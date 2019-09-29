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
    const minimumX = context.createConstantSource();
    const maximumX = context.createConstantSource();
    const minimumY = context.createConstantSource();
    const maximumY = context.createConstantSource();
    minimumX.offset.value = 0;
    minimumY.offset.value = 0;
    maximumX.offset.value = 1;
    maximumY.offset.value = 1;
    const moduleImplementation = {
      internalNodes: [],
      inputMap: new Map(),
      outputMap: new Map([['x', x], ['y', y]]),
      parameterMap: new Map([
        ['minimum x', minimumX.offset],
        ['maximum x', maximumX.offset],
        ['minimum y', minimumY.offset],
        ['maximum y', maximumY.offset]
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
          name: 'minimum x',
          moduleId: id,
          sources: [],
          minValue: parameterMin(minimumX.offset),
          maxValue: parameterMax(minimumX.offset),
          stepSize: 0.01,
          value: 0
        },
        {
          name: 'maximum x',
          moduleId: id,
          sources: [],
          minValue: parameterMin(maximumX.offset),
          maxValue: parameterMax(maximumX.offset),
          stepSize: 0.01,
          value: 1
        },
        {
          name: 'minimum y',
          moduleId: id,
          sources: [],
          minValue: parameterMin(minimumY.offset),
          maxValue: parameterMax(minimumY.offset),
          stepSize: 0.01,
          value: 0
        },
        {
          name: 'maximum y',
          moduleId: id,
          sources: [],
          minValue: parameterMin(maximumY.offset),
          maxValue: parameterMax(maximumY.offset),
          stepSize: 0.01,
          value: 1
        }
      ],
      []
    );
  }
}
