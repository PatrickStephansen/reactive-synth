import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';
import { makeDistortionCurve } from '../distortion-curve';

@Injectable()
export class DistortionFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Distortion;
  CreateAudioModule(
    context: IAudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: IAudioParam) => number,
    parameterMin: (parameter: IAudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string
  ): CreateModuleResult {
    const moduleType = AudioModuleType.Distortion;
    id = createModuleId(moduleType, id);
    const distortion = context.createWaveShaper();
    distortion.curve = makeDistortionCurve(context.sampleRate);
    distortion.oversample = '4x';
    const inputGain = context.createGain();
    inputGain.connect(distortion);
    graph.set(id, {
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
          minValue: parameterMin(inputGain.gain),
          maxValue: parameterMax(inputGain.gain),
          stepSize: 0.01
        }
      ],
      []
    );
  }
}
