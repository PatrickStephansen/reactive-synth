import { AudioModuleType } from './audio-module-type';

export interface AudioModule {
  id: string;
  name?: string;
  moduleType: AudioModuleType;
  canDelete: boolean;
  helpText?: string;
}
