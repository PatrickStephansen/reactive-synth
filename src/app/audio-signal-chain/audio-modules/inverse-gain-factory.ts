import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam, AudioWorkletNode } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class InverseGainFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.InverseGain;
  CreateAudioModule(
    context: IAudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: IAudioParam) => number,
    parameterMin: (parameter: IAudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string,
    wasmModule?: ArrayBuffer
  ): CreateModuleResult {
    const moduleType = AudioModuleType.InverseGain;
    id = createModuleId(moduleType, id);
    const inverseGain = new AudioWorkletNode(context, 'reactive-synth-inverse-gain', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1],
      channelInterpretation: 'speakers'
    });
    const divisorParameterKey = 'signal divisor';
    const fallBackValueKey = 'Output when divisor is zero';

    const moduleImplementation = {
      internalNodes: [inverseGain],
      inputMap: new Map([['input', inverseGain]]),
      outputMap: new Map([['output', inverseGain]]),
      parameterMap: new Map([
        [divisorParameterKey, inverseGain.parameters.get('divisor')],
        [fallBackValueKey, inverseGain.parameters.get('zeroDivisorFallback')]
      ])
    };
    inverseGain.port.postMessage({wasmModule, type: 'wasm'});

    graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Divides each sample of the incoming signal by the given divisor.
          Useful for converting between units like frequency and wavelength.`
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
          name: divisorParameterKey,
          moduleId: id,
          sources: [],
          maxValue: parameterMax(inverseGain.parameters.get('divisor')),
          minValue: parameterMin(inverseGain.parameters.get('divisor')),
          stepSize: 0.01,
          value: inverseGain.parameters.get('divisor').value,
          canConnectSources: true
        },
        {
          name: fallBackValueKey,
          moduleId: id,
          sources: [],
          maxValue: parameterMax(inverseGain.parameters.get('zeroDivisorFallback')),
          minValue: parameterMin(inverseGain.parameters.get('zeroDivisorFallback')),
          stepSize: 0.01,
          value: inverseGain.parameters.get('zeroDivisorFallback').value,
          canConnectSources: true
        }
      ],
      []
    );
  }
}
