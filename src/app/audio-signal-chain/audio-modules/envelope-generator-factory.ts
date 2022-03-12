import { EventEmitter, Injectable } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { frameRateLimit } from '../frame-rate-limit';
import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { ExtensionEvent } from '../model/extension-event';
import { ModuleSignalStage } from '../model/module-signal-stage';
import { TriggerExtension } from '../model/trigger-extension';
import { createModuleReadyPromise } from '../module-ready-promise';
import { observableFromMessagePort } from '../observable-from-message-port';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';


@Injectable()
export class EnvelopeGeneratorFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.EnvelopeGenerator;
  CreateAudioModule(
    context: AudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: AudioParam) => number,
    parameterMin: (parameter: AudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string,
    wasmModule?: ArrayBuffer
  ): Promise<CreateModuleResult> {
    try {
      const moduleType = AudioModuleType.EnvelopeGenerator;
      id = createModuleId(moduleType, id);
      const envelopeGeneratorNode = new AudioWorkletNode(
        context,
        'reactive-synth-envelope-generator',
        {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          channelCount: 1,
          channelCountMode: 'explicit',
          outputChannelCount: [1],
          processorOptions: { sampleRate: context.sampleRate }
        }
      );

      const trigger = envelopeGeneratorNode.parameters['get']('trigger');
      const attackValue = envelopeGeneratorNode.parameters['get']('attackValue');
      const attackTime = envelopeGeneratorNode.parameters['get']('attackTime');
      const holdTime = envelopeGeneratorNode.parameters['get']('holdTime');
      const decayTime = envelopeGeneratorNode.parameters['get']('decayTime');
      const sustainValue = envelopeGeneratorNode.parameters['get']('sustainValue');
      const releaseTime = envelopeGeneratorNode.parameters['get']('releaseTime');

      const outputGain = context.createGain();
      outputGain.gain.value = defaultGain;
      envelopeGeneratorNode.connect(outputGain);

      graph.set(id, {
        internalNodes: [envelopeGeneratorNode, outputGain],
        outputMap: new Map([['output', outputGain]]),
        parameterMap: new Map([
          ['trigger', trigger],
          ['attack value', attackValue],
          ['attack time', attackTime],
          ['hold time', holdTime],
          ['decay time', decayTime],
          ['sustain value', sustainValue],
          ['release time', releaseTime],
          ['output gain', outputGain.gain]
        ])
      });

      const envelopeTriggered = observableFromMessagePort(
        envelopeGeneratorNode.port,
        'trigger-change'
      ).pipe(frameRateLimit);
      envelopeGeneratorNode.port.postMessage({ type: 'wasm', wasmModule });
      envelopeGeneratorNode.port.start();

      const manualTriggerEventEmitter = new EventEmitter<ExtensionEvent>();
      const nextVisualizationFrameEventEmitter = new EventEmitter<void>();

      const stateUpdates = observableFromMessagePort(envelopeGeneratorNode.port, 'state').pipe(
        map(message => message.state)
      );
      subscriptions.push(
        manualTriggerEventEmitter.subscribe((next: ExtensionEvent) =>
          envelopeGeneratorNode.port.postMessage(next)
        ),
        nextVisualizationFrameEventEmitter.subscribe(() =>
          envelopeGeneratorNode.port.postMessage({ type: 'get-state' })
        )
      );

      return createModuleReadyPromise(envelopeGeneratorNode.port).then(
        () =>
          new CreateModuleResult(
            {
              id,
              name,
              moduleType,
              canDelete: true,
              helpText: `Creates an AHDSR envelope which reponds to trigger inputs.
            When the trigger value goes above 0 the attack stage starts.
            In the attack stage, the output value moves linearly from 0 to the attack value parameter value
            over a period of time given by the attack time.
            The attack value is then output for the hold time before starting the decay stage.
            The decay stage moves the output linearly towards the sustain value for the duration of the decay time.
            The sustain stage lasts indefinitely as long as the trigger value stays high, ouputing the sustain value.
            When the trigger value falls to 0 or below, the output value moves linearly towards 0 over the release time
            regardless of which phase the envelope was in.`
            },
            [],
            [
              {
                name: 'output',
                moduleId: id
              }
            ],
            [
              {
                name: 'trigger',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(trigger),
                minValue: parameterMin(trigger),
                stepSize: 0.01,
                value: trigger.defaultValue,
                extensions: [
                  new TriggerExtension(
                    new Map([['trigger-change', envelopeTriggered]]),
                    new Map([['manual-trigger', manualTriggerEventEmitter]])
                  )
                ],
                canConnectSources: true
              },
              {
                name: 'attack value',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(attackValue),
                minValue: parameterMin(attackValue),
                stepSize: 0.01,
                value: attackValue.defaultValue,
                canConnectSources: true
              },
              {
                name: 'attack time',
                units: 'seconds',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(attackTime),
                minValue: parameterMin(attackTime),
                stepSize: 0.001,
                value: 0.001,
                canConnectSources: true
              },
              {
                name: 'hold time',
                units: 'seconds',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(holdTime),
                minValue: parameterMin(holdTime),
                stepSize: 0.001,
                value: holdTime.defaultValue,
                canConnectSources: true
              },
              {
                name: 'decay time',
                units: 'seconds',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(decayTime),
                minValue: parameterMin(decayTime),
                stepSize: 0.001,
                value: decayTime.defaultValue,
                canConnectSources: true
              },
              {
                name: 'sustain value',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(sustainValue),
                minValue: parameterMin(sustainValue),
                stepSize: 0.01,
                value: sustainValue.defaultValue,
                canConnectSources: true
              },
              {
                name: 'release time',
                units: 'seconds',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(releaseTime),
                minValue: parameterMin(releaseTime),
                stepSize: 0.001,
                value: releaseTime.defaultValue,
                canConnectSources: true
              },
              {
                name: 'output gain',
                moduleId: id,
                sources: [],
                maxValue: parameterMax(outputGain.gain),
                minValue: parameterMin(outputGain.gain),
                stepSize: 0.01,
                value: defaultGain,
                canConnectSources: true
              }
            ],
            [],
            [
              {
                moduleId: id,
                dataLength: 1,
                isActive: false,
                name: 'envelope state',
                visualizationType: 'envelope',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [],
                getVisualizationData: () => {
                  console.error(
                    'This function should not be used: getVisualizationData() on envelope state visualizer.'
                  );
                },
                visualizationData$: stateUpdates,
                nextFrameEventEmitter: nextVisualizationFrameEventEmitter
              }
            ]
          )
      );
    } catch (error) {
      if (error.name === 'NotSupportedError') {
        throw new Error(`Unable to create envelope generator module.
        Your browser does not implement the AudioWorklet interface of the Web Audio API standard and
        this module has too many inputs for the fallback.
        Try a Chromium-based browser instead.`);
      } else {
        throw error;
      }
    }
  }
}
