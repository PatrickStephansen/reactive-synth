export interface ChangeParameterEvent {
  moduleId: string;
  parameterName: string;
  value: number;
  setImmediately?: boolean;
}
