export interface AudioNode {
  id: string;
  nodeType: string;
  numberInputs: number;
  numberOutputs: number;
  sourceIds: string[];
  canDelete: boolean;
  helpText?: string;
}
