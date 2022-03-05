export interface ModuleImplementation {
  internalNodes: AudioNode[];
  inputMap?: Map<string, AudioNode>;
  outputMap?: Map<string, AudioNode>;
  parameterMap?: Map<string, AudioParam>;
  choiceMap?: Map<string, (newValue: string) => void>;
}
