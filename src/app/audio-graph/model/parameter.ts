export interface Parameter {
  name: string;
  nodeId: string;
  value: number;
  units?: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  sourceIds: string[];
}
