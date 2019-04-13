import { AudioModuleType } from './audio-module-type';

export interface AudioModule {
  id: string;
  moduleType: AudioModuleType;
  numberInputs: number;
  numberOutputs: number;
  sourceIds: string[];
  canDelete: boolean;
  helpText?: string;
}
