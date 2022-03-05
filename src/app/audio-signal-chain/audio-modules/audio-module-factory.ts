import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleType } from '../model/audio-module-type';
import { ModuleImplementation } from './module-implementation';
import { InjectionToken } from '@angular/core';
import { Subscription } from 'rxjs';

export interface AudioModuleFactory {
  ModuleType: AudioModuleType;
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
  ): CreateModuleResult | Promise<CreateModuleResult>;
}

export const AUDIO_MODULE_FACTORY = new InjectionToken('AUDIO_MODULE_FACTORY');
