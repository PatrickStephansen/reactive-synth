import { Injectable } from '@angular/core';
import { IAudioContext, IAudioParam, AudioWorkletNode } from 'standardized-audio-context';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class BitCrusherFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.BitCrusher;
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
    wasmBinary?: ArrayBuffer
  ): CreateModuleResult {
    const moduleType = AudioModuleType.BitCrusher;
    id = createModuleId(moduleType, id);
    const crusher = new AudioWorkletNode(context, 'reactive-synth-bitcrusher', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: 'explicit',
      outputChannelCount: [1],
      channelInterpretation: 'speakers'
    });
    crusher.port.postMessage({ type: 'wasm', wasmBinary });
    const bitDepthParameterKey = 'bit depth';
    const bitDepthParameter = crusher.parameters['get']('bitDepth');
    const volumeControl = context.createGain();
    volumeControl.gain.value = defaultGain;
    crusher.connect(volumeControl);
    const moduleImplementation = {
      internalNodes: [crusher, volumeControl],
      inputMap: new Map([['input', crusher]]),
      outputMap: new Map([['output', volumeControl]]),
      parameterMap: new Map([
        [bitDepthParameterKey, bitDepthParameter],
        ['output gain', volumeControl.gain]
      ]),
      choiceMap: new Map([
        [
          'fractional bit depth mode',
          mode =>
            crusher.port.postMessage({
              type: 'change-fractional-bit-depth-mode',
              newMode: mode
            })
        ]
      ])
    };

    graph.set(id, moduleImplementation);
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Maps each sample to a less precise representation imitating an integer with a given number of bits.
        Fractional bit depth mode tells the module how to deal with cases where bit depth is not a whole number.
        Trve mode rounds down to the nearest whole number
        so it outputs only numbers that would be representable using the given number of bits in real hardware.
        Quantize-evenly mode causes bit depth to be rounded down to the nearest value that results in evenly spaced "steps"
        in the output.
        Continuous mode allows uneven quantization of the output space, so even small changes in bit depth will sound different.
        For example, since a number with 2 bits it can represent 4 values and a number with 3 bits can represent 8 values,
        there are bit depths in between 2 and 3 that can represent 5, 6, and 7 values.
        For best results, the incoming signal should have an amplitude close to 1 (ie. values between -1 and 1).`
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
          name: bitDepthParameterKey,
          moduleId: id,
          sources: [],
          maxValue: parameterMax(bitDepthParameter),
          minValue: parameterMin(bitDepthParameter),
          stepSize: 0.1,
          value: bitDepthParameter.defaultValue,
          canConnectSources: true
        },
        {
          name: 'output gain',
          moduleId: id,
          sources: [],
          maxValue: parameterMax(volumeControl.gain),
          minValue: parameterMin(volumeControl.gain),
          stepSize: 0.01,
          value: defaultGain,
          canConnectSources: true
        }
      ],
      [
        {
          name: 'fractional bit depth mode',
          moduleId: id,
          choices: ['quantize-evenly', 'continuous', 'trve'],
          selection: 'quantize-evenly'
        }
      ]
    );
  }
}
