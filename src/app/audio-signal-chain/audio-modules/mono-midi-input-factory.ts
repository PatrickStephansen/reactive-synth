import { Injectable } from '@angular/core';

import { AudioModuleType } from '../model/audio-module-type';
import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleFactory } from './audio-module-factory';
import { ModuleImplementation } from './module-implementation';
import { Subscription } from 'rxjs';

@Injectable()
export class MonoMidiInputFactory implements AudioModuleFactory {
  ModuleType = AudioModuleType.MonoMidiInput;
  async CreateAudioModule(
    context: AudioContext,
    graph: Map<string, ModuleImplementation>,
    defaultGain: number,
    parameterMax: (parameter: AudioParam) => number,
    parameterMin: (parameter: AudioParam) => number,
    createModuleId: (moduleType: string, id?: string) => string,
    subscriptions: Subscription[],
    id?: string,
    name?: string
  ): Promise<CreateModuleResult> {
    if (typeof navigator['requestMIDIAccess'] !== 'function') {
      throw new Error('This browser doesn\'t have MIDI support');
    }
    const moduleType = AudioModuleType.MonoMidiInput;
    id = createModuleId(moduleType, id);
    const gain = context.createGain();
    gain.gain.value = defaultGain;
    const gainParameterKey = 'velocity multiplier';
    const moduleImplementation = {
      internalNodes: [gain],
      outputMap: new Map([['velocity', gain]]),
      parameterMap: new Map([[gainParameterKey, gain.gain]])
    };

    graph.set(id, moduleImplementation);
    const access = await navigator['requestMIDIAccess']();
    const midiInputs = [...access.inputs.values()].map(i => ({ name: i.name, id: i.value }));
    return new CreateModuleResult(
      {
        id,
        name,
        moduleType,
        canDelete: true,
        helpText: `Interprets MIDI inputs for a specific channel and outputs control signals for note number, velocity, pitch bend, modulation, and maybe more in future`
      },
      [],
      [
        {
          name: 'velocity',
          moduleId: id
        },
        { name: 'note number', moduleId: id },
        { name: 'pitch bend', moduleId: id },
        { name: 'modwheel', moduleId: id }
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
      [
        {
          name: 'midi channel',
          moduleId: id,
          choices: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16'
          ],
          selection: '1'
        },
        {
          name: 'rollover mode',
          moduleId: id,
          choices: ['retrigger', 'legato'],
          selection: 'legato'
        },
        {
          name: 'midi input',
          moduleId: id,
          choices: midiInputs.map(i => i.name),
          selection: midiInputs?.[0]?.name ?? 'none'
        }
      ]
    );
  }
}
