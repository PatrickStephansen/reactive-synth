import { IAudioNode, IAudioParam } from 'standardized-audio-context';

export interface ModuleImplementation {
  internalNodes: IAudioNode[];
  inputMap?: Map<string, IAudioNode>;
  outputMap?: Map<string, IAudioNode>;
  parameterMap?: Map<string, IAudioParam>;
  choiceMap?: Map<string, (newValue: string) => void>;
}
