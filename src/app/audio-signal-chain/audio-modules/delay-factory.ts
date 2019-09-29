import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class DelayFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.Delay;
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
    const moduleType = AudioModuleType.Delay;
    id = createModuleId(moduleType, id);
    const delay = context.createDelay(60);
    const delayParameterKey = 'delay time';
    const moduleImplementation = {
      internalNodes: [delay],
      inputMap: new Map([['input', delay]]),
      outputMap: new Map([['output', delay]]),
      parameterMap: new Map([[delayParameterKey, delay.delayTime]])
    };

    graph.set(id, moduleImplementation);
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
          maxValue: parameterMax(delay.delayTime),
          minValue: parameterMin(delay.delayTime),
          stepSize: 0.01,
          value: delay.delayTime.value,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
