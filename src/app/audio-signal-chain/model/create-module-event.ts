import { AudioModuleType } from './audio-module-type';

export class CreateModuleEvent {
  constructor(public moduleType: AudioModuleType, public id?: string) {}
}
