import { Injectable } from '@angular/core';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class ConstantSourceFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.ConstantSource;
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
    const moduleType = AudioModuleType.ConstantSource;
    id = createModuleId(moduleType, id);
    const constant = context.createConstantSource();
    constant.start();
    graph.set(id, {
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
          maxValue: parameterMax(constant.offset),
          minValue: parameterMin(constant.offset),
          value: constant.offset.value,
          stepSize: 0.01,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
