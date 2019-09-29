import { AudioModuleOutput } from './audio-module-output';
import { ParameterExtension } from './parameter-extension';

export interface Parameter {
  name: string;
  moduleId: string;
  value: number;
  units?: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  sources: AudioModuleOutput[];
  extensions?: ParameterExtension[];
  canConnectSources: boolean;
}
