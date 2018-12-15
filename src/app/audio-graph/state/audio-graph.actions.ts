import { Action } from '@ngrx/store';
import { ConnectNodesEvent } from '../model/connect-nodes-event';
import { AudioNode } from '../model/audio-node';
import { ChangeParameterEvent } from '../model/change-parameter-event';
import { Parameter } from '../model/parameter';
import { AudioGraphState } from './audio-graph.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { ChangeChoiceEvent } from '../model/change-choice-event';
import { ConnectParameterEvent } from '../model/connect-parameter-event';
import { GraphError } from '../model/graph-error';

export enum AudioGraphActionTypes {
  ResetGraph = '[Audio Graph] Reset Graph',
  ResetGraphSuccess = '[Audio Graph] Reset Graph Success',
  ChangeParameter = '[Audio Graph] Change Parameter',
  ChangeParameterSuccess = '[Audio Graph] Change Parameter Success',
  ChangeChoiceParameter = '[Audio Graph] Change Choice Parameter',
  ChangeChoiceParameterSuccess = '[Audio Graph] Change Choice Parameter Success',
  ConnectNodes = '[Audio Graph] Connect Nodes',
  ConnectNodesSuccess = '[Audio Graph] Connect Nodes Success',
  DisconnectNodes = '[Audio Graph] Disconnect Nodes',
  DisconnectNodesSuccess = '[Audio Graph] Disconnect Nodes Success',
  ConnectParameter = '[Audio Graph] Connect Parameter',
  ConnectParameterSuccess = '[Audio Graph] Connect Parameter Success',
  DisconnectParameter = '[Audio Graph] Disconnect Parameter',
  DisconnectParameterSuccess = '[Audio Graph] Disconnect Parameter Success',
  CreateOscillator = '[Audio Graph] Create Oscillator',
  CreateGainNode = '[Audio Graph] Create Gain Node',
  CreateDelayNode = '[Audio Graph] Create Delay Node',
  CreateFilterNode = '[Audio Graph] Create Filter Node',
  CreateDistortionNode = '[Audio Graph] Create Distortion Node',
  CreateConstantSource = '[Audio Graph] Create Constant Source',
  CreateNodeSuccess = '[Audio Graph] Create Node Success',
  DestroyNode = '[Audio Graph] Destroy Node',
  DestroyNodeSuccess = '[Audio Graph] Destroy NodeSuccess',
  CreateParameterSuccess = '[Audio Graph] Create Parameter Success',
  CreateChoiceParameterSuccess = '[Audio Graph] Create Choice Parameter Success',
  ToggleGraphActive = '[Audio Graph] Toggle Graph Output Active',
  ToggleGraphActiveSuccess = '[Audio Graph] Toggle Graph Output Active Success',
  AddError = '[Audio Graph] Add Graph Change Error',
  DismissError = '[Audio Graph] Dismiss Graph Change Error',
  ClearErrors = '[Audio Graph] Clear All Graph Change Errors'
}

export class ResetGraph implements Action {
  readonly type = AudioGraphActionTypes.ResetGraph;
  constructor() {}
}
export class ResetGraphSuccess implements Action {
  readonly type = AudioGraphActionTypes.ResetGraphSuccess;
  constructor(public graph: AudioGraphState) {}
}

export class ChangeParameter implements Action {
  readonly type = AudioGraphActionTypes.ChangeParameter;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ChangeParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.ChangeParameterSuccess;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ChangeChoiceParameter implements Action {
  readonly type = AudioGraphActionTypes.ChangeChoiceParameter;
  constructor(public payload: ChangeChoiceEvent) {}
}

export class ChangeChoiceParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.ChangeChoiceParameterSuccess;
  constructor(public payload: ChangeChoiceEvent) {}
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
export class ConnectParameter implements Action {
  readonly type = AudioGraphActionTypes.ConnectParameter;

  constructor(public payload: ConnectParameterEvent) {}
}

export class ConnectParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.ConnectParameterSuccess;

  constructor(public payload: ConnectParameterEvent) {}
}
export class DisconnectParameter implements Action {
  readonly type = AudioGraphActionTypes.DisconnectParameter;

  constructor(public payload: ConnectParameterEvent) {}
}

export class DisconnectParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.DisconnectParameterSuccess;

  constructor(public payload: ConnectParameterEvent) {}
}

export class CreateOscillator implements Action {
  readonly type = AudioGraphActionTypes.CreateOscillator;

  constructor() {}
}

export class CreateGainNode implements Action {
  readonly type = AudioGraphActionTypes.CreateGainNode;

  constructor() {}
}

export class CreateDistortionNode implements Action {
  readonly type = AudioGraphActionTypes.CreateDistortionNode;

  constructor() {}
}

export class CreateConstantSource implements Action {
  readonly type = AudioGraphActionTypes.CreateConstantSource;

  constructor() {}
}

export class CreateDelayNode implements Action {
  readonly type = AudioGraphActionTypes.CreateDelayNode;

  constructor() {}
}

export class CreateFilterNode implements Action {
  readonly type = AudioGraphActionTypes.CreateFilterNode;

  constructor() {}
}

export class CreateNodeSuccess implements Action {
  readonly type = AudioGraphActionTypes.CreateNodeSuccess;

  constructor(public payload: AudioNode) {}
}

export class CreateParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.CreateParameterSuccess;

  constructor(public payload: Parameter) {}
}
export class CreateChoiceParameterSuccess implements Action {
  readonly type = AudioGraphActionTypes.CreateChoiceParameterSuccess;

  constructor(public payload: ChoiceParameter) {}
}

export class ToggleGraphActive implements Action {
  readonly type = AudioGraphActionTypes.ToggleGraphActive;

  constructor(public payload: boolean) {}
}
export class ToggleGraphActiveSuccess implements Action {
  readonly type = AudioGraphActionTypes.ToggleGraphActiveSuccess;

  constructor(public payload: boolean) {}
}

export class DestroyNode implements Action {
  readonly type = AudioGraphActionTypes.DestroyNode;

  constructor(public nodeId: string) {}
}

export class DestroyNodeSuccess implements Action {
  readonly type = AudioGraphActionTypes.DestroyNodeSuccess;

  constructor(public nodeId: string) {}
}

export class AddError implements Action {
  readonly type = AudioGraphActionTypes.AddError;

  constructor(public error: GraphError) {}
}

export class DismissError implements Action {
  readonly type = AudioGraphActionTypes.DismissError;

  constructor(public id: string) {}
}

export class ClearErrors implements Action {
  readonly type = AudioGraphActionTypes.ClearErrors;

  constructor() {}
}

export type AudioGraphAction =
  | ResetGraph
  | ResetGraphSuccess
  | ChangeParameter
  | ChangeParameterSuccess
  | ChangeChoiceParameter
  | ChangeChoiceParameterSuccess
  | ConnectNodes
  | ConnectNodesSuccess
  | DisconnectNodes
  | DisconnectNodesSuccess
  | ConnectParameter
  | ConnectParameterSuccess
  | DisconnectParameter
  | DisconnectParameterSuccess
  | CreateOscillator
  | CreateNodeSuccess
  | CreateParameterSuccess
  | CreateChoiceParameterSuccess
  | ToggleGraphActive
  | ToggleGraphActiveSuccess
  | CreateGainNode
  | CreateDistortionNode
  | CreateDelayNode
  | CreateFilterNode
  | CreateConstantSource
  | DestroyNode
  | DestroyNodeSuccess
  | AddError
  | DismissError
  | ClearErrors;
