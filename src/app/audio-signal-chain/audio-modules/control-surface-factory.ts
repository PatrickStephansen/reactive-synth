import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class ControlSurfaceFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.ControlSurface;
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
    const moduleType = AudioModuleType.ControlSurface;
    id = createModuleId(moduleType, id);
    const x = context.createConstantSource();
    const y = context.createConstantSource();
    x.offset.value = 0;
    y.offset.value = 0;
    x.start();
    y.start();
    const moduleImplementation = {
      internalNodes: [x, y],
      inputMap: new Map(),
      outputMap: new Map([['x', x], ['y', y]]),
      parameterMap: new Map([
        ['x', x.offset],
        ['y', y.offset]
      ])
    };

    graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Allows parameters to be controlled using a mouse or by touch on a 2D surface`
      },
      [],
      [
        {
          name: 'x',
          moduleId: id
        },
        {
          name: 'y',
          moduleId: id
        }
      ],
      [
        {
          name: 'x',
          moduleId: id,
          sources: [],
          minValue: parameterMin(x.offset),
          maxValue: parameterMax(x.offset),
          stepSize: 0.01,
          value: 0,
          canConnectSources: true
        },
        {
          name: 'y',
          moduleId: id,
          sources: [],
          minValue: parameterMin(y.offset),
          maxValue: parameterMax(y.offset),
          stepSize: 0.01,
          value: 0,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
