import { Injectable } from '@angular/core';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class FilterFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Filter;
  CreateAudioModule(
    context: AudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: AudioParam) => number,
    parameterMin: (parameter: AudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string
  ): CreateModuleResult {
    const moduleType = AudioModuleType.Filter;
    id = createModuleId(moduleType, id);
    const filter = context.createBiquadFilter();
    graph.set(id, {
      internalNodes: [filter],
      inputMap: new Map([['input', filter]]),
      outputMap: new Map([['output', filter]]),
      parameterMap: new Map([
        ['frequency', filter.frequency],
        ['quality factor', filter.Q],
        ['detune', filter.detune]
      ]),
      choiceMap: new Map([
        ['filter type', filterType => (filter.type = filterType as BiquadFilterType)]
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
          maxValue: parameterMax(filter.frequency),
          minValue: parameterMin(filter.frequency),
          stepSize: 1,
          sources: [],
          value: filter.frequency.value,
          canConnectSources: true
        },
        {
          name: 'detune',
          units: 'cents',
          moduleId: id,
          sources: [],
          maxValue: parameterMax(filter.detune),
          minValue: parameterMin(filter.detune),
          value: filter.detune.defaultValue,
          stepSize: 1,
          canConnectSources: true
        },
        {
          name: 'quality factor',
          moduleId: id,
          maxValue: parameterMax(filter.Q),
          minValue: 0,
          stepSize: 1,
          sources: [],
          value: filter.Q.value,
          canConnectSources: true
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
}
