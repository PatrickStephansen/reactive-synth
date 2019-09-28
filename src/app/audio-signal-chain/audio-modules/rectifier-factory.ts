import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';
import { makeRectifierCurve } from '../rectifier-curve';

@Injectable()
export class RectifierFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Rectifier;
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
    const moduleType = AudioModuleType.Rectifier;
    id = createModuleId(moduleType, id);
    const rectifier = context.createWaveShaper();
    rectifier.curve = makeRectifierCurve();
    rectifier.oversample = '4x';
    const inputGain = context.createGain();
    inputGain.connect(rectifier);
    const outputGain = context.createGain();
    rectifier.connect(outputGain);
    graph.set(id, {
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
          minValue: parameterMin(inputGain.gain),
          maxValue: parameterMax(inputGain.gain),
          value: inputGain.gain.value,
          stepSize: 0.01,
          sources: []
        },
        {
          name: 'output gain',
          moduleId: id,
          minValue: parameterMin(outputGain.gain),
          maxValue: parameterMax(outputGain.gain),
          value: outputGain.gain.value,
          stepSize: 0.01,
          sources: []
        }
      ],
      []
    );
  }
}
