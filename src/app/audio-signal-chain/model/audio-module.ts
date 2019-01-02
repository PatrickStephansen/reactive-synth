export interface AudioModule {
  id: string;
  moduleType: string;
  numberInputs: number;
  numberOutputs: number;
  sourceIds: string[];
  canDelete: boolean;
  helpText?: string;
}
