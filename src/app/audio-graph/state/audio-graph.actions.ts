import { Action } from '@ngrx/store';
import { ConnectNodesEvent } from '../connect-nodes-event';
import { AudioNode } from '../audio-node';
import { ChangeParameterEvent } from '../change-parameter-event';
import { Parameter } from '../parameter';

export enum AudioGraphActionTypes {
  ResetGraph = '[Audio Graph] Reset Graph',
  ResetGraphSuccess = '[Audio Graph] Reset Graph Success',
  ChangeParameter = '[Audio Graph] Change Parameter',
  ChangeParameterSuccess = '[Audio Graph] Change Parameter Success',
  ConnectNodes = '[Audio Graph] Connect Nodes',
  ConnectNodesSuccess = '[Audio Graph] Connect Nodes Success',
  CreateOscillator = '[Audio Graph] Create Oscillator',
  CreateNodeSuccess = '[Audio Graph] Create Node Success',
  CreateParameterSuccess = '[Audio Graph Create Parameter Success]'
}

export class ResetGraph implements Action {
  readonly type = AudioGraphActionTypes.ResetGraph;
  constructor() {}
}
export class ResetGraphSuccess implements Action {
  readonly type = AudioGraphActionTypes.ResetGraphSuccess;
  constructor() {}
}

export class ChangeParameter implements Action {
  readonly type = AudioGraphActionTypes.ChangeParameter;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ChangeParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.ChangeParameterSuccess;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ConnectNodes implements Action {
  readonly type = AudioGraphActionTypes.ConnectNodes;

  constructor(public payload: ConnectNodesEvent) {}
}

export class ConnectNodesSuccess implements Action {
  readonly type = AudioGraphActionTypes.ConnectNodesSuccess;

  constructor(public payload: ConnectNodesEvent) {}
}
export class CreateOscillator implements Action {
  readonly type = AudioGraphActionTypes.CreateOscillator;

  constructor() {}
}

export class CreateOscillatorSuccess implements Action {
  readonly type = AudioGraphActionTypes.CreateNodeSuccess;

  constructor(public payload: AudioNode) {}
}

export class CreateParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.CreateParameterSuccess;

  constructor(public payload: Parameter) {}
}

export type AudioGraphAction =
  | ResetGraph
  | ResetGraphSuccess
  | ChangeParameter
  | ChangeParameterSuccess
  | ConnectNodes
  | ConnectNodesSuccess
  | CreateOscillator
  | CreateOscillatorSuccess
  | CreateParameterSuccess;
