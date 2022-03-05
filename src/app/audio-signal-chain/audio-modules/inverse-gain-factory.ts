import { Injectable } from '@angular/core';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';
import { createModuleReadyPromise } from '../module-ready-promise';

@Injectable()
export class InverseGainFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.InverseGain;
  CreateAudioModule(
    context: AudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: AudioParam) => number,
    parameterMin: (parameter: AudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string,
    wasmModule?: ArrayBuffer
  ): Promise<CreateModuleResult> {
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
        [divisorParameterKey, inverseGain.parameters['get']('divisor')],
        [fallBackValueKey, inverseGain.parameters['get']('zeroDivisorFallback')]
      ])
    };
    inverseGain.port.postMessage({ wasmModule, type: 'wasm' });
    inverseGain.port.start();

    graph.set(id, moduleImplementation);

    return createModuleReadyPromise(inverseGain.port).then(
      () =>
        new CreateModuleResult(
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
              maxValue: parameterMax(inverseGain.parameters['get']('divisor')),
              minValue: parameterMin(inverseGain.parameters['get']('divisor')),
              stepSize: 0.01,
              value: inverseGain.parameters['get']('divisor').value,
              canConnectSources: true
            },
            {
              name: fallBackValueKey,
              moduleId: id,
              sources: [],
              maxValue: parameterMax(inverseGain.parameters['get']('zeroDivisorFallback')),
              minValue: parameterMin(inverseGain.parameters['get']('zeroDivisorFallback')),
              stepSize: 0.01,
              value: inverseGain.parameters['get']('zeroDivisorFallback').value,
              canConnectSources: true
            }
          ],
          []
        )
    );
  }
}
