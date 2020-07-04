import { Injectable, EventEmitter } from '@angular/core';
import { IAudioContext, IAudioParam, AudioWorkletNode } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { observableFromMessagePort } from '../observable-from-message-port';
import { frameRateLimit } from '../frame-rate-limit';
import { ExtensionEvent } from '../model/extension-event';
import { TriggerExtension } from '../model/trigger-extension';
import { Subscription } from 'rxjs';

@Injectable()
export class NoiseGeneratorFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.NoiseGenerator;
  CreateAudioModule(
    context: IAudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: IAudioParam) => number,
    parameterMin: (parameter: IAudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string,
    wasmModule?: ArrayBuffer
  ): CreateModuleResult {
    const moduleType = AudioModuleType.NoiseGenerator;
    id = createModuleId(moduleType, id);
    const noiseGeneratorNode = new AudioWorkletNode(context, 'reactive-synth-noise-generator', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1],
      channelInterpretation: 'speakers'
    });
    const stepMin = noiseGeneratorNode.parameters.get('stepMin');
    const stepMax = noiseGeneratorNode.parameters.get('stepMax');
    const sampleHold = noiseGeneratorNode.parameters.get('sampleHold');
    const nextValueTrigger = noiseGeneratorNode.parameters.get('nextValueTrigger');
    const volumeControl = context.createGain();
    volumeControl.gain.value = defaultGain;
    noiseGeneratorNode.connect(volumeControl);
    graph.set(id, {
      internalNodes: [noiseGeneratorNode, volumeControl],
      outputMap: new Map([['output', volumeControl]]),
      parameterMap: new Map([
        ['minimum step size', stepMin],
        ['maximum step size', stepMax],
        ['sample hold', sampleHold],
        ['next value trigger', nextValueTrigger],
        ['output gain', volumeControl.gain]
      ])
    });

    const nextSampleTriggerChanged = observableFromMessagePort(
      noiseGeneratorNode.port,
      'trigger-change'
    ).pipe(frameRateLimit);
    noiseGeneratorNode.port.start();
    noiseGeneratorNode.port.postMessage({ type: 'wasm', wasmModule });

    const manualTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    subscriptions.push(
      manualTriggerEventEmitter.subscribe((next: ExtensionEvent) =>
        noiseGeneratorNode.port.postMessage(next)
      )
    );

    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `A noise generator that generates each sample based on the previous sample.
        The minimum and maximum step size can be used to create bias towards different pitches.
        Increase the minimum to boost high frequencies. Decrease the maximum to boost low frequesncies.
        If minimum is higher than maximum, their roles swap around.
        Sample hold allows the rate of generation to be slowed down.
        1 means every sample gets a new value, 2 means every second sample does etc.
        Values less than 1 mean new samples are never generated.
        The next value trigger parameter causes 1 new sample to be generated when its value becomes positive.
        Its value must become 0 or less before it will trigger a new sample again
        ie. connecting an oscillator running at 440Hz will cause new samples to be generated at 440 times a second.`
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
          moduleId: id,
          sources: [],
          name: 'minimum step size',
          maxValue: parameterMax(stepMin),
          minValue: parameterMin(stepMin),
          value: stepMin.value,
          stepSize: 0.01,
          canConnectSources: true
        },
        {
          moduleId: id,
          sources: [],
          name: 'maximum step size',
          maxValue: parameterMax(stepMax),
          minValue: parameterMin(stepMax),
          value: stepMax.value,
          stepSize: 0.01,
          canConnectSources: true
        },
        {
          moduleId: id,
          sources: [],
          name: 'sample hold',
          maxValue: parameterMax(sampleHold),
          minValue: parameterMin(sampleHold),
          value: sampleHold.value,
          stepSize: 1,
          canConnectSources: true
        },
        {
          moduleId: id,
          sources: [],
          name: 'next value trigger',
          maxValue: parameterMax(nextValueTrigger),
          minValue: parameterMin(nextValueTrigger),
          value: nextValueTrigger.value,
          stepSize: 0.01,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', nextSampleTriggerChanged]]),
              new Map([['manual-trigger', manualTriggerEventEmitter]])
            )
          ],
          canConnectSources: true
        },
        {
          name: 'output gain',
          moduleId: id,
          sources: [],
          maxValue: parameterMax(volumeControl.gain),
          minValue: parameterMin(volumeControl.gain),
          stepSize: 0.01,
          value: defaultGain,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
