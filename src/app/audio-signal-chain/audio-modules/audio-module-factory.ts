import { CreateModuleResult } from '../model/create-module-result';
import { AudioModuleType } from '../model/audio-module-type';
import { IAudioContext, IAudioParam } from 'standardized-audio-context';
import { ModuleImplementation } from './module-implementation';
import { InjectionToken } from '@angular/core';
import { Subscription } from 'rxjs';

export interface AudioModuleFactory {
  ModuleType: AudioModuleType;
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
    wasmModule?: WebAssembly.Module
  ): CreateModuleResult | Promise<CreateModuleResult>;
}

export const AUDIO_MODULE_FACTORY = new InjectionToken('AUDIO_MODULE_FACTORY');
