import { Action } from '@ngrx/store';

export enum AudioGraphActionTypes {
  ResetGraph = '[Audio Graph] Create Graph',
  ParameterChanged = '[Audio Graph] Parameter Changed'
}

export class ResetGraph implements Action {
  readonly type = AudioGraphActionTypes.ResetGraph;
  constructor() {}
}

export class ParameterChanged implements Action {
  readonly type = AudioGraphActionTypes.ParameterChanged;
  constructor(
    public payload: { nodeId: string; parameterName: string; value: number }
  ) {}
}

export type AudioGraphAction = ResetGraph;
