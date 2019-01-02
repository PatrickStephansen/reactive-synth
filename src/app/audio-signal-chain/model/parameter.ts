export interface Parameter {
  name: string;
  moduleId: string;
  value: number;
  units?: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  sourceIds: string[];
}
