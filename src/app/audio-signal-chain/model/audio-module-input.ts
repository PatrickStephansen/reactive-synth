import { AudioModuleOutput } from './audio-module-output';

export interface AudioModuleInput {
  name: string;
  moduleId: string;
  sources: AudioModuleOutput[];
}
