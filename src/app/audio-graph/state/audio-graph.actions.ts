import { Action } from '@ngrx/store';
import { ConnectNodesEvent } from '../model/connect-nodes-event';
import { AudioNode } from '../model/audio-node';
import { ChangeParameterEvent } from '../model/change-parameter-event';
import { Parameter } from '../model/parameter';
import { AudioGraphState } from './audio-graph.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { ChangeChoiceEvent } from '../model/change-choice-event';

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
  CreateOscillator = '[Audio Graph] Create Oscillator',
  CreateGainNode = '[Audio Graph] Create Gain Node',
  CreateDelayNode = '[Audio Graph] Create Delay Node',
  CreateDistortionNode = '[Audio Graph] Create Distortion Node',
  CreateConstantSource = '[Audio Graph] Create Constant Source',
  CreateNodeSuccess = '[Audio Graph] Create Node Success',
  DestroyNode = '[Audio Graph] Destroy Node',
  DestroyNodeSuccess = '[Audio Graph] Destroy NodeSuccess',
  CreateParameterSuccess = '[Audio Graph] Create Parameter Success',
  CreateChoiceParameterSuccess = '[Audio Graph] Create Choice Parameter Success',
  ToggleGraphActive = '[Audio Graph] Toggle Graph Output Active',
  ToggleGraphActiveSuccess = '[Audio Graph] Toggle Graph Output Active Success'
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

  constructor(public nodeId) {}
}

export class DestroyNodeSuccess implements Action {
  readonly type = AudioGraphActionTypes.DestroyNodeSuccess;

  constructor(public nodeId) {}
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
  | CreateOscillator
  | CreateNodeSuccess
  | CreateParameterSuccess
  | CreateChoiceParameterSuccess
  | ToggleGraphActive
  | ToggleGraphActiveSuccess
  | CreateGainNode
  | CreateDistortionNode
  | CreateDelayNode
  | CreateConstantSource
  | DestroyNode
  | DestroyNodeSuccess;
