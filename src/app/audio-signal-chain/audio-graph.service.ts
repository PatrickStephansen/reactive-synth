import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { isNil, last } from 'ramda';
import {
  AudioWorkletNode,
  AudioContext,
  IAudioParam,
  IAudioNode,
  TBiquadFilterType
} from 'standardized-audio-context';

import { AudioSignalChainState } from './state/audio-signal-chain.state';
import { makeDistortionCurve } from './distortion-curve';
import { ConnectParameterEvent } from './model/connect-parameter-event';
import { makeRectifierCurve } from './rectifier-curve';
import { ModuleSignalStage } from './model/module-signal-stage';
import {
  linearScalingStrategy,
  logarithmicScalingStrategy
} from './model/visualization/scaling-strategy';
import { AudioModuleType } from './model/audio-module-type';
import { CreateModuleResult } from './model/create-module-result';
import { ConnectModulesEvent } from './model/connect-modules-event';
import { TriggerExtension } from './model/trigger-extension';
import { Subscription } from 'rxjs';
import { ExtensionEvent } from './model/extension-event';
import { observableFromMessagePort } from './observable-from-message-port';
import { sampleTime, map } from 'rxjs/operators';
import { workletUrl } from '../cache-hack/cache';
import { ModuleImplementation } from './audio-modules/module-implementation';
import { AUDIO_MODULE_FACTORY, AudioModuleFactory } from './audio-modules/audio-module-factory';

let incrementingId = 0;
const frameRateLimit = sampleTime<ExtensionEvent>(1000 / 144);

@Injectable({
  providedIn: 'root'
})
export class AudioGraphService {
  private graph: Map<string, ModuleImplementation>;
  private context: AudioContext;

  private defaultGain = 0.1;

  private createModuleMap: Map<AudioModuleType, (id: string, name: string) => CreateModuleResult>;
  private moduleFactoryMap: Map<AudioModuleType, AudioModuleFactory>;
  private subscriptions: Subscription[] = [];

  private parameterMax(parameter: IAudioParam) {
    return Math.min(parameter.maxValue, 1000000000);
  }

  private parameterMin(parameter: IAudioParam) {
    return Math.max(parameter.minValue, -1000000000);
  }

  constructor(
    private locationService: Location,
    @Inject(AUDIO_MODULE_FACTORY) moduleFactories: AudioModuleFactory[]
  ) {
    this.moduleFactoryMap = new Map(moduleFactories.map(factory => [factory.ModuleType, factory]));
    this.createModuleMap = new Map([
      [AudioModuleType.ConstantSource, (id, name) => this.createConstantSource(id, name)],
      [AudioModuleType.Delay, (id, name) => this.createDelayModule(id, name)],
      [AudioModuleType.Distortion, (id, name) => this.createDistortionModule(id, name)],
      [AudioModuleType.Filter, (id, name) => this.createFilterModule(id, name)],
      [AudioModuleType.InverseGain, (id, name) => this.createInverseGainModule(id, name)],
      [AudioModuleType.NoiseGenerator, (id, name) => this.createNoiseGenerator(id, name)],
      [AudioModuleType.Rectifier, (id, name) => this.createRectifierModule(id, name)],
      [
        AudioModuleType.EnvelopeGenerator,
        (id, name) => this.createEnvelopeGeneratorModule(id, name)
      ],
      [AudioModuleType.ClockDivider, (id, name) => this.createClockDividerModule(id, name)],
      [AudioModuleType.Output, (id, name) => null]
    ]);
  }

  private destroyContext() {
    if (this.context) {
      return this.context.close();
    }
    return Promise.resolve();
  }

  private createModuleId(moduleType: string, id?: string) {
    if (isNil(id)) {
      return `${moduleType}-${incrementingId++}`;
    }
    incrementingId = Number.parseInt(last(id.split('-')), 10) + 1;
    return id;
  }

  unmute(): Promise<void> {
    return this.context ? this.context.resume() : Promise.reject('No audio context to resume');
  }

  mute(): Promise<void> {
    return this.context ? this.context.suspend() : Promise.reject('No audio context to suspend');
  }

  endSubscriptions(): void {
    while (this.subscriptions.length) {
      const sub = this.subscriptions.pop();
      sub.unsubscribe();
    }
  }

  resetGraph(outputModuleName?: string): Promise<AudioSignalChainState> {
    const subscriptionsPromise = new Promise(resolve => resolve(this.endSubscriptions()));
    return subscriptionsPromise
      .then(() => this.destroyContext())
      .then(() => {
        if (typeof AudioContext !== 'function') {
          throw new Error(
            `Your browser is not supported because it does not implement the Web Audio API.
          Try reloading the page in a newer browser.
          If you're using iOS, none of them will work due to Apple store policy restrictions.`
          );
        }
        this.context = new AudioContext();
        incrementingId = 0;

        const visualizer = this.context.createAnalyser();
        visualizer.connect(this.context.destination);
        this.graph = new Map([
          [
            'Output to Speakers',
            {
              internalNodes: [visualizer, this.context.destination],
              inputMap: new Map([['audio to play', visualizer]])
            }
          ]
        ]);
        return this.context.audioWorklet
          .addModule(this.locationService.prepareExternalUrl(workletUrl))
          .then(() => ({
            modules: [
              {
                id: 'Output to Speakers',
                name: outputModuleName,
                moduleType: AudioModuleType.Output,
                canDelete: false,
                helpText: `Signals must be connected to this module to be audible.
              Incoming signals are summed and clamped to the range [-1, 1].
              Click the visualizations to pause them. Click their headings to hide them to save space.`
              }
            ],
            inputs: [
              {
                moduleId: 'Output to Speakers',
                name: 'audio to play',
                sources: []
              }
            ],
            outputs: [],
            parameters: [],
            choiceParameters: [],
            visualizations: [
              {
                moduleId: 'Output to Speakers',
                name: 'waveform',
                dataLength: visualizer.fftSize,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [linearScalingStrategy, linearScalingStrategy],
                isActive: true,
                getVisualizationData: data => visualizer.getByteTimeDomainData(data)
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - log',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [logarithmicScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data)
              },
              {
                moduleId: 'Output to Speakers',
                name: 'spectrum - linear',
                dataLength: visualizer.frequencyBinCount,
                visualizationType: 'line-graph',
                visualizationStage: ModuleSignalStage.input,
                renderingStrategyPerAxis: [linearScalingStrategy, linearScalingStrategy],
                isActive: false,
                getVisualizationData: data => visualizer.getByteFrequencyData(data)
              }
            ],
            muted: this.context.state && this.context.state === 'suspended',
            errors: []
          }));
      });
  }

  createModule(moduleType: AudioModuleType, id?: string, name?: string): CreateModuleResult {
    const matchingFactory = this.moduleFactoryMap.get(moduleType);
    if (matchingFactory) {
      return matchingFactory.CreateAudioModule(
        this.context,
        this.graph,
        this.defaultGain,
        this.parameterMax,
        this.parameterMin,
        this.createModuleId,
        id,
        name
      );
    }
    return this.createModuleMap.get(moduleType)(id, name);
  }

  createNoiseGenerator(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.NoiseGenerator;
    id = this.createModuleId(moduleType, id);
    const noiseGeneratorNode = new AudioWorkletNode(this.context, 'noise', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1]
    });
    const stepMin = noiseGeneratorNode.parameters.get('stepMin');
    const stepMax = noiseGeneratorNode.parameters.get('stepMax');
    const sampleHold = noiseGeneratorNode.parameters.get('sampleHold');
    const nextValueTrigger = noiseGeneratorNode.parameters.get('nextValueTrigger');
    const volumeControl = this.context.createGain();
    volumeControl.gain.value = this.defaultGain;
    noiseGeneratorNode.connect(volumeControl);
    this.graph.set(id, {
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

    const manualTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    this.subscriptions.push(
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
          maxValue: this.parameterMax(stepMin),
          minValue: this.parameterMin(stepMin),
          value: stepMin.value,
          stepSize: 0.01
        },
        {
          moduleId: id,
          sources: [],
          name: 'maximum step size',
          maxValue: this.parameterMax(stepMax),
          minValue: this.parameterMin(stepMax),
          value: stepMax.value,
          stepSize: 0.01
        },
        {
          moduleId: id,
          sources: [],
          name: 'sample hold',
          maxValue: this.parameterMax(sampleHold),
          minValue: this.parameterMin(sampleHold),
          value: sampleHold.value,
          stepSize: 1
        },
        {
          moduleId: id,
          sources: [],
          name: 'next value trigger',
          maxValue: this.parameterMax(nextValueTrigger),
          minValue: this.parameterMin(nextValueTrigger),
          value: nextValueTrigger.value,
          stepSize: 0.01,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', nextSampleTriggerChanged]]),
              new Map([['manual-trigger', manualTriggerEventEmitter]])
            )
          ]
        },
        {
          name: 'output gain',
          moduleId: id,
          sources: [],
          maxValue: this.parameterMax(volumeControl.gain),
          minValue: this.parameterMin(volumeControl.gain),
          stepSize: 0.01,
          value: this.defaultGain
        }
      ],
      []
    );
  }

  createClockDividerModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.ClockDivider;
    id = this.createModuleId(moduleType, id);
    const clockDividerNode = new AudioWorkletNode(this.context, 'clock-divider', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1]
    });

    const clockTrigger = clockDividerNode.parameters.get('clockTrigger');
    const resetTrigger = clockDividerNode.parameters.get('resetTrigger');
    const attackAfterTicks = clockDividerNode.parameters.get('attackAfterTicks');
    const releaseAfterTocks = clockDividerNode.parameters.get('releaseAfterTocks');

    const outputGain = this.context.createGain();
    outputGain.gain.value = this.defaultGain;
    clockDividerNode.connect(outputGain);

    this.graph.set(id, {
      internalNodes: [clockDividerNode, outputGain],
      outputMap: new Map([['output', outputGain]]),
      parameterMap: new Map([
        ['clock trigger', clockTrigger],
        ['reset trigger', resetTrigger],
        ['attack after ticks', attackAfterTicks],
        ['release after tocks', releaseAfterTocks],
        ['output gain', outputGain.gain]
      ])
    });

    const clockTriggered = observableFromMessagePort(
      clockDividerNode.port,
      'clock-trigger-change'
    ).pipe(frameRateLimit);
    clockDividerNode.port.start();

    const manualClockTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    this.subscriptions.push(
      manualClockTriggerEventEmitter
        .pipe(map((event: ExtensionEvent) => ({ ...event, type: 'manual-clock-trigger' })))
        .subscribe((next: ExtensionEvent) => clockDividerNode.port.postMessage(next))
    );
    const resetTriggered = observableFromMessagePort(
      clockDividerNode.port,
      'reset-trigger-change'
    ).pipe(frameRateLimit);
    clockDividerNode.port.start();

    const manualResetTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

    this.subscriptions.push(
      manualResetTriggerEventEmitter
        .pipe(map((event: ExtensionEvent) => ({ ...event, type: 'manual-reset-trigger' })))
        .subscribe((next: ExtensionEvent) => clockDividerNode.port.postMessage(next))
    );

    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Interprets the incoming Clock Trigger parameter as a clock signal and outputs clock pulses of equal or slower tempo.
          The signal is interpretted as being a tick when sample value is greater than 0 and
          as a tock when the sample value is 0 or less.
          The Attack After Ticks and Release After Ticks parameters control the ratio between incoming and output clock pulses.
          Higher values mean more incoming pulses per output pulse.
          The Reset Trigger puts the module back in a state where it will output a tick on the next tick received.
          It can be used to synchronize with other modules.
        `
      },
      [],
      [
        {
          moduleId: id,
          name: 'output'
        }
      ],
      [
        {
          moduleId: id,
          name: 'clock trigger',
          sources: [],
          stepSize: 0.01,
          maxValue: this.parameterMax(clockTrigger),
          minValue: this.parameterMin(clockTrigger),
          value: clockTrigger.defaultValue,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', clockTriggered]]),
              new Map([['manual-trigger', manualClockTriggerEventEmitter]])
            )
          ]
        },
        {
          moduleId: id,
          name: 'reset trigger',
          sources: [],
          stepSize: 0.01,
          maxValue: this.parameterMax(resetTrigger),
          minValue: this.parameterMin(resetTrigger),
          value: resetTrigger.defaultValue,
          extensions: [
            new TriggerExtension(
              new Map([['trigger-change', resetTriggered]]),
              new Map([['manual-trigger', manualResetTriggerEventEmitter]])
            )
          ]
        },
        {
          moduleId: id,
          name: 'attack after ticks',
          sources: [],
          stepSize: 0.25,
          maxValue: this.parameterMax(attackAfterTicks),
          minValue: this.parameterMin(attackAfterTicks),
          value: attackAfterTicks.defaultValue
        },
        {
          moduleId: id,
          name: 'release after tocks',
          sources: [],
          stepSize: 0.25,
          maxValue: this.parameterMax(releaseAfterTocks),
          minValue: this.parameterMin(releaseAfterTocks),
          value: releaseAfterTocks.defaultValue
        },
        {
          moduleId: id,
          name: 'output gain',
          sources: [],
          stepSize: 0.01,
          maxValue: this.parameterMax(outputGain.gain),
          minValue: this.parameterMin(outputGain.gain),
          value: this.defaultGain
        }
      ],
      []
    );
  }

  createEnvelopeGeneratorModule(id?: string, name?: string): CreateModuleResult {
    try {
      const moduleType = AudioModuleType.EnvelopeGenerator;
      id = this.createModuleId(moduleType, id);
      const envelopeGeneratorNode = new AudioWorkletNode(this.context, 'envelope-generator', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        channelCount: 1,
        channelCountMode: 'explicit',
        outputChannelCount: [1],
        processorOptions: { sampleRate: this.context.sampleRate }
      });

      const trigger = envelopeGeneratorNode.parameters.get('trigger');
      const attackValue = envelopeGeneratorNode.parameters.get('attackValue');
      const attackTime = envelopeGeneratorNode.parameters.get('attackTime');
      const holdTime = envelopeGeneratorNode.parameters.get('holdTime');
      const decayTime = envelopeGeneratorNode.parameters.get('decayTime');
      const sustainValue = envelopeGeneratorNode.parameters.get('sustainValue');
      const releaseTime = envelopeGeneratorNode.parameters.get('releaseTime');

      const outputGain = this.context.createGain();
      outputGain.gain.value = this.defaultGain;
      envelopeGeneratorNode.connect(outputGain);

      this.graph.set(id, {
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
      envelopeGeneratorNode.port.start();

      const manualTriggerEventEmitter = new EventEmitter<ExtensionEvent>();

      this.subscriptions.push(
        manualTriggerEventEmitter.subscribe((next: ExtensionEvent) =>
          envelopeGeneratorNode.port.postMessage(next)
        )
      );

      return new CreateModuleResult(
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
            maxValue: this.parameterMax(trigger),
            minValue: this.parameterMin(trigger),
            stepSize: 0.01,
            value: trigger.defaultValue,
            extensions: [
              new TriggerExtension(
                new Map([['trigger-change', envelopeTriggered]]),
                new Map([['manual-trigger', manualTriggerEventEmitter]])
              )
            ]
          },
          {
            name: 'attack value',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(attackValue),
            minValue: this.parameterMin(attackValue),
            stepSize: 0.01,
            value: attackValue.defaultValue
          },
          {
            name: 'attack time',
            units: 'seconds',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(attackTime),
            minValue: this.parameterMin(attackTime),
            stepSize: 0.001,
            value: 0.001
          },
          {
            name: 'hold time',
            units: 'seconds',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(holdTime),
            minValue: this.parameterMin(holdTime),
            stepSize: 0.001,
            value: holdTime.defaultValue
          },
          {
            name: 'decay time',
            units: 'seconds',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(decayTime),
            minValue: this.parameterMin(decayTime),
            stepSize: 0.001,
            value: decayTime.defaultValue
          },
          {
            name: 'sustain value',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(sustainValue),
            minValue: this.parameterMin(sustainValue),
            stepSize: 0.01,
            value: sustainValue.defaultValue
          },
          {
            name: 'release time',
            units: 'seconds',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(releaseTime),
            minValue: this.parameterMin(releaseTime),
            stepSize: 0.001,
            value: releaseTime.defaultValue
          },
          {
            name: 'output gain',
            moduleId: id,
            sources: [],
            maxValue: this.parameterMax(outputGain.gain),
            minValue: this.parameterMin(outputGain.gain),
            stepSize: 0.01,
            value: this.defaultGain
          }
        ],
        []
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

  createInverseGainModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.InverseGain;
    id = this.createModuleId(moduleType, id);
    const inverseGain = new AudioWorkletNode(this.context, 'inverse-gain', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: 'explicit',
      outputChannelCount: [2],
      channelInterpretation: 'speakers'
    });
    const divisorParameterKey = 'signal divisor';
    const fallBackValueKey = 'Output when divisor is zero';

    const moduleImplementation = {
      internalNodes: [inverseGain],
      inputMap: new Map([['input', inverseGain]]),
      outputMap: new Map([['output', inverseGain]]),
      parameterMap: new Map([
        [divisorParameterKey, inverseGain.parameters.get('divisor')],
        [fallBackValueKey, inverseGain.parameters.get('zeroDivisorFallback')]
      ])
    };

    this.graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Divides each sample of the incoming signal by the given divisor.
          Useful for converting between units like frequency and wavelength.`
      },
      [
        {
          name: 'input',
          moduleId: id,
          sources: []
        }
      ],
      [
        {
          name: 'output',
          moduleId: id
        }
      ],
      [
        {
          name: divisorParameterKey,
          moduleId: id,
          sources: [],
          maxValue: this.parameterMax(inverseGain.parameters.get('divisor')),
          minValue: this.parameterMin(inverseGain.parameters.get('divisor')),
          stepSize: 0.01,
          value: inverseGain.parameters.get('divisor').value
        },
        {
          name: fallBackValueKey,
          moduleId: id,
          sources: [],
          maxValue: this.parameterMax(inverseGain.parameters.get('zeroDivisorFallback')),
          minValue: this.parameterMin(inverseGain.parameters.get('zeroDivisorFallback')),
          stepSize: 0.01,
          value: inverseGain.parameters.get('zeroDivisorFallback').value
        }
      ],
      []
    );
  }

  createDelayModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.Delay;
    id = this.createModuleId(moduleType, id);
    const delay = this.context.createDelay(60);
    const delayParameterKey = 'delay time';
    const moduleImplementation = {
      internalNodes: [delay],
      inputMap: new Map([['input', delay]]),
      outputMap: new Map([['output', delay]]),
      parameterMap: new Map([[delayParameterKey, delay.delayTime]])
    };

    this.graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Emits the incoming signal unchanged after the set delay time.
          Allows feedback loops to be created in the audio signal-chain.
          Try connecting a percussive sound source, then feed the output to a gain module with a value between 0 and 1,
          and connect that gain module back to the input of the delay.
          Modulating the delay time allows phaser and chorus effects to be created.`
      },
      [
        {
          name: 'input',
          moduleId: id,
          sources: []
        }
      ],
      [
        {
          name: 'output',
          moduleId: id
        }
      ],
      [
        {
          name: delayParameterKey,
          units: 'seconds',
          moduleId: id,
          sources: [],
          maxValue: this.parameterMax(delay.delayTime),
          minValue: this.parameterMin(delay.delayTime),
          stepSize: 0.01,
          value: delay.delayTime.value
        }
      ],
      []
    );
  }

  createFilterModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.Filter;
    id = this.createModuleId(moduleType, id);
    const filter = this.context.createBiquadFilter();
    this.graph.set(id, {
      internalNodes: [filter],
      inputMap: new Map([['input', filter]]),
      outputMap: new Map([['output', filter]]),
      parameterMap: new Map([
        ['frequency', filter.frequency],
        ['quality factor', filter.Q],
        ['detune', filter.detune]
      ]),
      choiceMap: new Map([
        ['filter type', filterType => (filter.type = filterType as TBiquadFilterType)]
      ])
    });
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Shapes the frequency response of the incoming signal.
          Use it in lowpass mode to tame the upper harmonics and make sawtooth and square waves more listenable,
          or to reduce the pop caused by their discontinuities when used at low frequencies.
          Quality factor controls the steepness of the frequency response curve.
          Higher values behave similarly to resonance on an analogue filter.`
      },
      [
        {
          name: 'input',
          moduleId: id,
          sources: []
        }
      ],
      [
        {
          name: 'output',
          moduleId: id
        }
      ],
      [
        {
          name: 'frequency',
          units: 'hertz',
          moduleId: id,
          maxValue: this.parameterMax(filter.frequency),
          minValue: this.parameterMin(filter.frequency),
          stepSize: 1,
          sources: [],
          value: filter.frequency.value
        },
        {
          name: 'detune',
          units: 'cents',
          moduleId: id,
          sources: [],
          maxValue: this.parameterMax(filter.detune),
          minValue: this.parameterMin(filter.detune),
          value: filter.detune.defaultValue,
          stepSize: 1
        },
        {
          name: 'quality factor',
          moduleId: id,
          maxValue: this.parameterMax(filter.Q),
          minValue: 0,
          stepSize: 1,
          sources: [],
          value: filter.Q.value
        }
      ],
      [
        {
          name: 'filter type',
          moduleId: id,
          choices: ['lowpass', 'highpass', 'bandpass', 'notch', 'allpass'],
          selection: filter.type
        }
      ]
    );
  }

  createDistortionModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.Distortion;
    id = this.createModuleId(moduleType, id);
    const distortion = this.context.createWaveShaper();
    distortion.curve = makeDistortionCurve(this.context.sampleRate);
    distortion.oversample = '4x';
    const inputGain = this.context.createGain();
    inputGain.connect(distortion);
    this.graph.set(id, {
      internalNodes: [inputGain, distortion],
      parameterMap: new Map([['input gain', inputGain.gain]]),
      inputMap: new Map([['input', inputGain]]),
      outputMap: new Map([['output', distortion]])
    });
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `A simple wave shaping distortion that adds more harmonic content to boring waveforms.
          It also makes interference between waves easier to hear.
          Try connecting a low and a high frequency sine oscillator to the input, and the distortion output to the speakers.
          Distortion clips the incoming signal to the range [-1, 1], so it can be used to shape the signal from low frequency oscillators.
          For example, a triangle wave with amplitude > 1 becomes closer to a square wave
          with smoother transitions between the high and low value.`
      },
      [
        {
          name: 'input',
          moduleId: id,
          sources: []
        }
      ],
      [
        {
          name: 'output',
          moduleId: id
        }
      ],
      [
        {
          name: 'input gain',
          moduleId: id,
          sources: [],
          value: inputGain.gain.value,
          minValue: this.parameterMin(inputGain.gain),
          maxValue: this.parameterMax(inputGain.gain),
          stepSize: 0.01
        }
      ],
      []
    );
  }

  createRectifierModule(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.Rectifier;
    id = this.createModuleId(moduleType, id);
    const rectifier = this.context.createWaveShaper();
    rectifier.curve = makeRectifierCurve();
    rectifier.oversample = '4x';
    const inputGain = this.context.createGain();
    inputGain.connect(rectifier);
    const outputGain = this.context.createGain();
    rectifier.connect(outputGain);
    this.graph.set(id, {
      internalNodes: [inputGain, rectifier, outputGain],
      parameterMap: new Map([['input gain', inputGain.gain], ['output gain', outputGain.gain]]),
      inputMap: new Map([['input', inputGain]]),
      outputMap: new Map([['output', outputGain]])
    });
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Clips incoming samples to the range [0, 1]. Values between 0 and 1 are untouched.
          Useful for shaping low freqency oscillators for precise controls like pitch (detune or frequency).
          When used together with a constant source and gain, a waveform can be shifted to any range.`
      },
      [
        {
          name: 'input',
          moduleId: id,
          sources: []
        }
      ],
      [
        {
          name: 'output',
          moduleId: id
        }
      ],
      [
        {
          name: 'input gain',
          moduleId: id,
          minValue: this.parameterMin(inputGain.gain),
          maxValue: this.parameterMax(inputGain.gain),
          value: inputGain.gain.value,
          stepSize: 0.01,
          sources: []
        },
        {
          name: 'output gain',
          moduleId: id,
          minValue: this.parameterMin(outputGain.gain),
          maxValue: this.parameterMax(outputGain.gain),
          value: outputGain.gain.value,
          stepSize: 0.01,
          sources: []
        }
      ],
      []
    );
  }

  createConstantSource(id?: string, name?: string): CreateModuleResult {
    const moduleType = AudioModuleType.ConstantSource;
    id = this.createModuleId(moduleType, id);
    const constant = this.context.createConstantSource();
    constant.start();
    this.graph.set(id, {
      internalNodes: [constant],
      parameterMap: new Map([['output value', constant.offset]]),
      outputMap: new Map([['output', constant]])
    });
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Emits a "constant" stream of samples with the value of the Output Value parameter.
          It is not always constant since the output value can be modulated.
          Useful for adding an offset to a waveform or for controlling multiple parameters from one place.
          It can be used together with a gain module for unit conversions eg.
          feed it into a gain multiplier of 0.016666 to convert beats per minute to hertz.`
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
          name: 'output value',
          maxValue: this.parameterMax(constant.offset),
          minValue: this.parameterMin(constant.offset),
          value: constant.offset.value,
          stepSize: 0.01
        }
      ],
      []
    );
  }

  connectModules({
    sourceId,
    sourceOutputName,
    destinationId,
    destinationInputName
  }: ConnectModulesEvent): void {
    if (
      this.graph.has(sourceId) &&
      this.graph.has(destinationId) &&
      this.graph.get(sourceId).outputMap &&
      this.graph.get(sourceId).outputMap.has(sourceOutputName) &&
      this.graph.get(destinationId).inputMap &&
      this.graph.get(destinationId).inputMap.has(destinationInputName)
    ) {
      const sourceNode = this.graph.get(sourceId).outputMap.get(sourceOutputName);
      const destinationNode = this.graph.get(destinationId).inputMap.get(destinationInputName);
      sourceNode.connect(destinationNode);
    } else {
      console.warn('attempted to connect modules that do not exist', sourceId, destinationId);
    }
  }

  disconnectModules({
    sourceId,
    sourceOutputName,
    destinationId,
    destinationInputName
  }: ConnectModulesEvent): void {
    if (
      this.graph.has(sourceId) &&
      this.graph.has(destinationId) &&
      this.graph.get(sourceId).outputMap &&
      this.graph.get(sourceId).outputMap.has(sourceOutputName) &&
      this.graph.get(destinationId).inputMap &&
      this.graph.get(destinationId).inputMap.has(destinationInputName)
    ) {
      const sourceNode = this.graph.get(sourceId).outputMap.get(sourceOutputName);
      const destinationNode = this.graph.get(destinationId).inputMap.get(destinationInputName);
      sourceNode.disconnect(destinationNode);
    }
  }

  connectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.get(event.sourceModuleId).outputMap &&
      this.graph.get(event.sourceModuleId).outputMap.has(event.sourceOutputName) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap &&
      this.graph.get(event.destinationModuleId).parameterMap.has(event.destinationParameterName)
    ) {
      this.graph
        .get(event.sourceModuleId)
        .outputMap.get(event.sourceOutputName)
        .connect(
          this.graph.get(event.destinationModuleId).parameterMap.get(event.destinationParameterName)
        );
    } else {
      console.warn(
        'attempted to connect parameters that do not exist',
        event.sourceModuleId,
        event.sourceOutputName,
        event.destinationModuleId,
        event.destinationParameterName
      );
    }
  }

  disconnectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.get(event.sourceModuleId).outputMap &&
      this.graph.get(event.sourceModuleId).outputMap.has(event.sourceOutputName) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap &&
      this.graph.get(event.destinationModuleId).parameterMap.has(event.destinationParameterName)
    ) {
      this.graph
        .get(event.sourceModuleId)
        .outputMap.get(event.sourceOutputName)
        .disconnect(
          this.graph.get(event.destinationModuleId).parameterMap.get(event.destinationParameterName)
        );
    }
  }

  changeParameterValue(
    moduleId: string,
    parameterName: string,
    value: number,
    setImmediately?: boolean
  ): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).parameterMap) {
      const param = this.graph.get(moduleId).parameterMap.get(parameterName);
      if (param && param.setTargetAtTime && !setImmediately) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.005);
      } else {
        param.value = value;
      }
    }
  }

  makeChoice(moduleId: string, choiceName: string, value: string): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).choiceMap) {
      const choice = this.graph.get(moduleId).choiceMap.get(choiceName);
      if (choice) {
        choice(value);
      }
    }
  }

  destroyModule(moduleId: string): void {
    if (this.graph.has(moduleId)) {
      this.graph.get(moduleId).internalNodes.forEach(module => {
        module.disconnect();
        if (module['stop']) {
          module['stop']();
        }
      });
      this.graph.delete(moduleId);
    }
  }
}
