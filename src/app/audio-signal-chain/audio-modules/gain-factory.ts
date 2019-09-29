import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class GainFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Gain;
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
    const moduleType = AudioModuleType.Gain;
    id = createModuleId(moduleType, id);
    const gain = context.createGain();
    gain.gain.value = defaultGain;
    const gainParameterKey = 'signal multiplier';
    const moduleImplementation = {
      internalNodes: [gain],
      inputMap: new Map([['input', gain]]),
      outputMap: new Map([['output', gain]]),
      parameterMap: new Map([[gainParameterKey, gain.gain]])
    };

    graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Multiplies each sample of the incoming signal by a factor to boost or attenuate it.
          Similar to a Voltage Controlled Amplifier in a physical synth.
          Negative values invert the phase of the signal.`
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
          name: gainParameterKey,
          moduleId: id,
          sources: [],
          maxValue: parameterMax(gain.gain),
          minValue: parameterMin(gain.gain),
          stepSize: 0.01,
          value: defaultGain,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
