import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';

@Injectable()
export class OscillatorFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Oscillator;
  CreateAudioModule(
    context: IAudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: IAudioParam) => number,
    parameterMin: (parameter: IAudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    id?: string,
    name?: string
  ): CreateModuleResult {
    const moduleType = AudioModuleType.Oscillator;
    id = createModuleId(moduleType, id);
    const oscillator = context.createOscillator();
    const volumeControl = context.createGain();
    volumeControl.gain.value = defaultGain;
    oscillator.connect(volumeControl);
    oscillator.start();
    const moduleImplementation = {
      internalNodes: [oscillator, volumeControl],
      outputMap: new Map([['output', volumeControl]]),
      parameterMap: new Map([
        ['frequency', oscillator.frequency],
        ['detune', oscillator.detune],
        ['output gain', volumeControl.gain]
      ]),
      choiceMap: new Map([['waveform', waveForm => (oscillator.type = waveForm)]])
    };
    graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
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
      [],
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
          sources: [],
          maxValue: parameterMax(oscillator.frequency),
          minValue: parameterMin(oscillator.frequency),
          value: oscillator.frequency.defaultValue,
          stepSize: 1
        },
        {
          name: 'detune',
          units: 'cents',
          moduleId: id,
          sources: [],
          maxValue: 1000000000,
          minValue: -1000000000,
          value: oscillator.detune.defaultValue,
          stepSize: 1
        },
        {
          name: 'output gain',
          moduleId: id,
          sources: [],
          maxValue: parameterMax(volumeControl.gain),
          minValue: parameterMin(volumeControl.gain),
          stepSize: 0.01,
          value: defaultGain
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
    );
  }
}
