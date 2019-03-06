import { Injectable } from '@angular/core';
import { head, last } from 'ramda';
import {
  AudioWorkletNode,
  AudioContext,
  IAudioParam,
  IAudioNode
} from 'standardized-audio-context';

import { AudioModule as ModuleModel } from './model/audio-module';
import { Parameter as ParameterModel } from './model/parameter';
import { ChoiceParameter as ChoiceParameterModel } from './model/choice-parameter';
import { AudioSignalChainState } from './state/audio-signal-chain.state';
import { makeDistortionCurve } from './distortion-curve';
import { ConnectParameterEvent } from './model/connect-parameter-event';
import { makeRectifierCurve } from './rectifier-curve';
import { ModuleSignalStage } from './model/module-signal-stage';
import {
  linearScalingStrategy,
  logarithmicScalingStrategy
} from './model/visualization/scaling-strategy';

let incrementingId = 0;

interface ModuleImplementation {
  internalNodes: IAudioNode[];
  parameterMap?: Map<string, IAudioParam>;
  choiceMap?: Map<string, [IAudioNode, string]>;
}

@Injectable({
  providedIn: 'root'
})
export class AudioGraphService {
  private graph: Map<string, ModuleImplementation>;
  private context: AudioContext;

  private defaultGain = 0.1;

  private parameterMax(parameter: IAudioParam) {
    return Math.min(parameter.maxValue, 1000000000);
  }

  private parameterMin(parameter: IAudioParam) {
    return Math.max(parameter.minValue, -1000000000);
  }

  constructor() {}

  private destroyContext() {
    if (this.context) {
      return this.context.close();
    }
    return Promise.resolve();
  }

  private createId(moduleType: string) {
    return `${moduleType}-${incrementingId++}`;
  }

  unmute(): Promise<void> {
    return this.context
      ? this.context.resume()
      : Promise.reject('No audio context to resume');
  }

  mute(): Promise<void> {
    return this.context
      ? this.context.suspend()
      : Promise.reject('No audio context to suspend');
  }

  resetGraph(): Promise<AudioSignalChainState> {
    return this.destroyContext().then(() => {
      if (typeof AudioContext !== 'function') {
        throw new Error(
          `Your browser is not supported because it does not implement the Web Audio API.
          Try reloading the page in a newer browser.
          If you're using iOS, none of them will work due to Apple store policy restrictions.`
        );
      }
      this.context = new AudioContext();

      const visualizer = this.context.createAnalyser();
      visualizer.connect(this.context.destination);
      this.graph = new Map([
        [
          'Output to Speakers',
          { internalNodes: [visualizer, this.context.destination] }
        ]
      ]);
      return this.context
        .suspend()
        .then(() =>
          this.context.audioWorklet.addModule(
            '/assets/audio-worklet-processors/noise.js'
          )
        )
        .then(() => ({
          modules: [
            {
              id: 'Output to Speakers',
              moduleType: 'output',
              numberInputs: 1,
              numberOutputs: 0,
              sourceIds: [],
              canDelete: false,
              helpText: `Signals must be connected to this module to be audible.
              Incoming signals are summed and clamped to the range [-1, 1].
              Click the visualizations to pause them. Click their headings to hide them to save space.`
            }
          ],
          parameters: [],
          choiceParameters: [],
          visualizations: [
            {
              moduleId: 'Output to Speakers',
              name: 'waveform',
              dataLength: visualizer.fftSize,
              visualizationType: 'line-graph',
              visualizationStage: ModuleSignalStage.input,
              renderingStrategyPerAxis: [
                linearScalingStrategy,
                linearScalingStrategy
              ],
              isActive: true,
              getVisualizationData: data =>
                visualizer.getByteTimeDomainData(data)
            },
            {
              moduleId: 'Output to Speakers',
              name: 'spectrum - log',
              dataLength: visualizer.frequencyBinCount,
              visualizationType: 'line-graph',
              visualizationStage: ModuleSignalStage.input,
              renderingStrategyPerAxis: [
                logarithmicScalingStrategy,
                linearScalingStrategy
              ],
              isActive: false,
              getVisualizationData: data =>
                visualizer.getByteFrequencyData(data)
            },
            {
              moduleId: 'Output to Speakers',
              name: 'spectrum - linear',
              dataLength: visualizer.frequencyBinCount,
              visualizationType: 'line-graph',
              visualizationStage: ModuleSignalStage.input,
              renderingStrategyPerAxis: [
                linearScalingStrategy,
                linearScalingStrategy
              ],
              isActive: false,
              getVisualizationData: data =>
                visualizer.getByteFrequencyData(data)
            }
          ],
          muted: this.context.state && this.context.state === 'suspended',
          errors: []
        }));
    });
  }

  createNoiseGenerator(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'noise';
    const id = this.createId(moduleType);
    const noiseGeneratorNode = new AudioWorkletNode(this.context, 'noise', {
      // work-around for https://github.com/chrisguttandin/standardized-audio-context/issues/493
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: 'explicit'
    });
    const stepMin = noiseGeneratorNode.parameters['get']('stepMin');
    const stepMax = noiseGeneratorNode.parameters['get']('stepMax');
    this.graph.set(id, {
      internalNodes: [noiseGeneratorNode],
      parameterMap: new Map([['step min', stepMin], ['step max', stepMax]])
    });
    return [
      {
        id,
        moduleType,
        numberInputs: 0,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `A noise generator that generates each sample based on the previous sample.
        The min and max step size can be used to create bias towards different pitches,
        almost like a highpass and lowpass filter respectively.`
      },
      [
        {
          moduleId: id,
          sourceIds: [],
          name: 'step min',
          maxValue: this.parameterMax(stepMin),
          minValue: this.parameterMin(stepMin),
          value: stepMin.value,
          stepSize: 0.01
        },
        {
          moduleId: id,
          sourceIds: [],
          name: 'step max',
          maxValue: this.parameterMax(stepMax),
          minValue: this.parameterMin(stepMax),
          value: stepMax.value,
          stepSize: 0.01
        }
      ]
    ];
  }

  createOscillator(): [ModuleModel, ParameterModel[], ChoiceParameterModel[]] {
    const moduleType = 'oscillator';
    const id = this.createId(moduleType);
    const oscillator = this.context.createOscillator();
    const volumeControl = this.context.createGain();
    volumeControl.gain.value = this.defaultGain;
    oscillator.connect(volumeControl);
    oscillator.start();
    const moduleImplementation = {
      internalNodes: [oscillator, volumeControl],
      parameterMap: new Map([
        ['frequency', oscillator.frequency],
        ['detune', oscillator.detune],
        ['output gain', volumeControl.gain]
      ]),
      choiceMap: new Map([
        ['waveform', [oscillator, 'type'] as [IAudioNode, string]]
      ])
    };
    this.graph.set(id, moduleImplementation);
    return [
      {
        id,
        moduleType,
        numberInputs: 0,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `A source that emits a periodic wave.
          Similar to a Voltage Controlled Oscillator or Low Frequency Oscillator in a physical synth.
          Negative frequency or gain values invert the phase.
          Detune is a frequency offset in cents, which means 100 per semi-tone ie. 1200 per octave.
          Output gain should be between -1 and 1 for audible signals.
          Connect directly to the output to hear a constant tone.
          The frequency and gain parameters can be modulated by connecting them to another oscillator.
          Try connecting a low frequency inverted sawtooth to the output gain of an audible oscillator for a percussive sound.`
      },
      [
        {
          name: 'frequency',
          units: 'hertz',
          moduleId: id,
          sourceIds: [],
          maxValue: this.parameterMax(oscillator.frequency),
          minValue: this.parameterMin(oscillator.frequency),
          value: oscillator.frequency.defaultValue,
          stepSize: 1
        },
        {
          name: 'detune',
          units: 'cents',
          moduleId: id,
          sourceIds: [],
          maxValue: this.parameterMax(oscillator.detune),
          minValue: this.parameterMin(oscillator.detune),
          value: oscillator.detune.defaultValue,
          stepSize: 1
        },
        {
          name: 'output gain',
          moduleId: id,
          sourceIds: [],
          maxValue: this.parameterMax(volumeControl.gain),
          minValue: this.parameterMin(volumeControl.gain),
          stepSize: 0.01,
          value: this.defaultGain
        }
      ],
      [
        {
          name: 'waveform',
          moduleId: id,
          choices: ['sine', 'triangle', 'sawtooth', 'square'],
          selection: 'sine'
        }
      ]
    ];
  }

  createGainModule(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'gain';
    const id = this.createId(moduleType);
    const gain = this.context.createGain();
    gain.gain.value = this.defaultGain;
    const gainParameterKey = 'signal multiplier';
    const moduleImplementation = {
      internalNodes: [gain],
      parameterMap: new Map([[gainParameterKey, gain.gain]])
    };

    this.graph.set(id, moduleImplementation);
    return [
      {
        id,
        moduleType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `Multiplies each sample of the incoming signal by a factor to boost or attenuate it.
          Similar to a Voltage Controlled Amplifier in a physical synth.
          Negative values invert the phase of the signal.`
      },
      [
        {
          name: gainParameterKey,
          moduleId: id,
          sourceIds: [],
          maxValue: this.parameterMax(gain.gain),
          minValue: this.parameterMin(gain.gain),
          stepSize: 0.01,
          value: this.defaultGain
        }
      ]
    ];
  }

  createDelayModule(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'delay';
    const id = this.createId(moduleType);
    const delay = this.context.createDelay(60);
    const delayParameterKey = 'delay time';
    const moduleImplementation = {
      internalNodes: [delay],
      parameterMap: new Map([[delayParameterKey, delay.delayTime]])
    };

    this.graph.set(id, moduleImplementation);
    return [
      {
        id,
        moduleType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `Emits the incoming signal unchanged after the set delay time.
          Allows feedback loops to be created in the audio signal-chain.
          Try connecting a percussive sound source, then feed the output to a gain module with a value between 0 and 1,
          and connect that gain module back to the input of the delay.
          Modulating the delay time allows phaser and chorus effects to be created.`
      },
      [
        {
          name: delayParameterKey,
          units: 'seconds',
          moduleId: id,
          sourceIds: [],
          maxValue: this.parameterMax(delay.delayTime),
          minValue: this.parameterMin(delay.delayTime),
          stepSize: 0.01,
          value: delay.delayTime.value
        }
      ]
    ];
  }

  createFilterModule(): [
    ModuleModel,
    ParameterModel[],
    ChoiceParameterModel[]
  ] {
    const moduleType = 'filter';
    const id = this.createId(moduleType);
    const filter = this.context.createBiquadFilter();
    this.graph.set(id, {
      internalNodes: [filter],
      parameterMap: new Map([
        ['frequency', filter.frequency],
        ['quality factor', filter.Q],
        ['detune', filter.detune]
      ]),
      choiceMap: new Map([
        ['filter type', [filter, 'type'] as [IAudioNode, string]]
      ])
    });
    return [
      {
        id,
        moduleType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `Shapes the frequency response of the incoming signal.
          Use it in lowpass mode to tame the upper harmonics and make sawtooth and square waves more listenable,
          or to reduce the pop caused by their discontinuities when used at low frequencies.
          Quality factor controls the steepness of the frequency response curve.
          Higher values behave similarly to resonance on an analogue filter.`
      },
      [
        {
          name: 'frequency',
          units: 'hertz',
          moduleId: id,
          maxValue: this.parameterMax(filter.frequency),
          minValue: this.parameterMin(filter.frequency),
          stepSize: 1,
          sourceIds: [],
          value: filter.frequency.value
        },
        {
          name: 'detune',
          units: 'cents',
          moduleId: id,
          sourceIds: [],
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
          sourceIds: [],
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
    ];
  }

  createDistortionModule(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'distortion';
    const id = this.createId(moduleType);
    const distortion = this.context.createWaveShaper();
    distortion.curve = makeDistortionCurve(this.context.sampleRate);
    distortion.oversample = '4x';
    this.graph.set(id, {
      internalNodes: [distortion]
    });
    return [
      {
        id,
        moduleType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `A simple wave shaping distortion that adds more harmonic content to boring waveforms.
          It also makes interference between waves easier to hear.
          Try connecting a low and a high frequency sine oscillator to the input, and the distortion output to the speakers.
          Distortion clips the incoming signal to the range [-1, 1], so it can be used to shape the signal from low frequency oscillators.
          For example, a triangle wave with amplitude > 1 becomes closer to a square wave
          with smoother transitions between the high and low value.`
      },
      []
    ];
  }

  createRectifierModule(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'rectifier';
    const id = this.createId(moduleType);
    const rectifier = this.context.createWaveShaper();
    rectifier.curve = makeRectifierCurve();
    rectifier.oversample = '4x';
    this.graph.set(id, {
      internalNodes: [rectifier]
    });
    return [
      {
        id,
        moduleType,
        numberInputs: 1,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `Clips incoming samples to the range [0, 1]. Values between 0 and 1 are untouched.
          Useful for shaping low freqency oscillators for precise controls like pitch (detune or frequency).
          When used together with a constant source and gain, a waveform can be shifted to any range.`
      },
      []
    ];
  }

  createConstantSource(): [ModuleModel, ParameterModel[]] {
    const moduleType = 'constant';
    const id = this.createId(moduleType);
    const constant = this.context.createConstantSource();
    constant.start();
    this.graph.set(id, {
      internalNodes: [constant],
      parameterMap: new Map([['output value', constant.offset]])
    });
    return [
      {
        id,
        moduleType,
        numberInputs: 0,
        numberOutputs: 1,
        sourceIds: [],
        canDelete: true,
        helpText: `Emits a "constant" stream of samples with the value of the Output Value parameter.
          It is not always constant since the output value can be modulated.
          Useful for adding an offset to a waveform or for controlling multiple parameters from one place.
          It can be used together with a gain module for unit conversions eg.
          feed it into a gain multiplier of 0.016666 to convert beats per minute to hertz.`
      },
      [
        {
          moduleId: id,
          sourceIds: [],
          name: 'output value',
          maxValue: this.parameterMax(constant.offset),
          minValue: this.parameterMin(constant.offset),
          value: constant.offset.value,
          stepSize: 0.01
        }
      ]
    ];
  }

  connectModules(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      last(this.graph.get(sourceId).internalNodes).connect(
        head(this.graph.get(destinationId).internalNodes)
      );
    }
  }

  disconnectModules(sourceId: string, destinationId: string): void {
    if (this.graph.has(sourceId) && this.graph.has(destinationId)) {
      last(this.graph.get(sourceId).internalNodes).disconnect(
        head(this.graph.get(destinationId).internalNodes)
      );
    }
  }

  connectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap
    ) {
      const destinationParameter = this.graph
        .get(event.destinationModuleId)
        .parameterMap.get(event.destinationParameterName);
      if (destinationParameter) {
        last(this.graph.get(event.sourceModuleId).internalNodes).connect(
          destinationParameter
        );
      }
    }
  }

  disconnectParameter(event: ConnectParameterEvent): void {
    if (
      this.graph.has(event.sourceModuleId) &&
      this.graph.has(event.destinationModuleId) &&
      this.graph.get(event.destinationModuleId).parameterMap
    ) {
      const destinationParameter = this.graph
        .get(event.destinationModuleId)
        .parameterMap.get(event.destinationParameterName);
      if (destinationParameter) {
        last(this.graph.get(event.sourceModuleId).internalNodes).disconnect(
          destinationParameter
        );
      }
    }
  }

  changeParameterValue(
    moduleId: string,
    parameterName: string,
    value: number
  ): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).parameterMap) {
      const param = this.graph.get(moduleId).parameterMap.get(parameterName);
      if (param && param.setTargetAtTime) {
        // don't change immediately as an anti-pop precaution
        param.setTargetAtTime(value, this.context.currentTime, 0.005);
      }
    }
  }

  makeChoice(moduleId: string, choiceName: string, value: string): void {
    if (this.graph.has(moduleId) && this.graph.get(moduleId).choiceMap) {
      const choice = this.graph.get(moduleId).choiceMap.get(choiceName);
      if (choice) {
        const [module, property] = choice;
        module[property] = value;
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
