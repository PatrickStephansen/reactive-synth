export interface ChangeParameterBoundsEvent {
  moduleId: string;
  parameterName: string;
  newMinValue: number;
  newMaxValue: number;
}
