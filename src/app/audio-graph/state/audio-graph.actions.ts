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
  DisconnectNodes = '[Audio Graph] Disconnect Nodes',
  DisconnectNodesSuccess = '[Audio Graph] Disconnect Nodes Success',
  CreateOscillator = '[Audio Graph] Create Oscillator',
  CreateGainNode = '[Audio Graph] Create Gain Node',
  CreateNodeSuccess = '[Audio Graph] Create Node Success',
  CreateParameterSuccess = '[Audio Graph] Create Parameter Success',
  ToggleGraphActive = '[Audio Graph] Toggle Graph Output Active',
  ToggleGraphActiveSuccess = '[Audio Graph] Toggle Graph Output Active Success'
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
export class DisconnectNodes implements Action {
  readonly type = AudioGraphActionTypes.DisconnectNodes;

  constructor(public payload: ConnectNodesEvent) {}
}

export class DisconnectNodesSuccess implements Action {
  readonly type = AudioGraphActionTypes.DisconnectNodesSuccess;

  constructor(public payload: ConnectNodesEvent) {}
}

export class CreateOscillator implements Action {
  readonly type = AudioGraphActionTypes.CreateOscillator;

  constructor() {}
}
export class CreateGainNode implements Action {
  readonly type = AudioGraphActionTypes.CreateGainNode;

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

export class ToggleGraphActive implements Action {
  readonly type = AudioGraphActionTypes.ToggleGraphActive;

  constructor(public payload: boolean) {}
}
export class ToggleGraphActiveSuccess implements Action {
  readonly type = AudioGraphActionTypes.ToggleGraphActiveSuccess;

  constructor(public payload: boolean) {}
}

export type AudioGraphAction =
  | ResetGraph
  | ResetGraphSuccess
  | ChangeParameter
  | ChangeParameterSuccess
  | ConnectNodes
  | ConnectNodesSuccess
  | DisconnectNodes
  | DisconnectNodesSuccess
  | CreateOscillator
  | CreateOscillatorSuccess
  | CreateParameterSuccess
  | ToggleGraphActive
  | ToggleGraphActiveSuccess
  | CreateGainNode;
