import { Action } from '@ngrx/store';
import { ConnectModulesEvent } from '../model/connect-modules-event';
import { AudioModule } from '../model/audio-module';
import { ChangeParameterEvent } from '../model/change-parameter-event';
import { Parameter } from '../model/parameter';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { ChoiceParameter } from '../model/choice-parameter';
import { ChangeChoiceEvent } from '../model/change-choice-event';
import { ConnectParameterEvent } from '../model/connect-parameter-event';
import { SignalChainError } from '../model/signal-chain-error';
import { ChangeVisualizationActiveEvent } from '../model/visualization/change-visualization-active-event';
import { CreateModuleEvent } from '../model/create-module-event';
import { AudioModuleInput } from '../model/audio-module-input';
import { AudioModuleOutput } from '../model/audio-module-output';

export enum AudioSignalChainActionTypes {
  ResetSignalChain = '[Audio Signal Chain] Reset Signal Chain',
  ResetSignalChainSuccess = '[Audio Signal Chain] Reset SignalChain Success',
  LoadSignalChainState = '[Audio Signal Chain] Load State',
  LoadSignalChainStateFailure = '[Audio Signal Chain] Load State Failure',
  ChangeParameter = '[Audio Signal Chain] Change Parameter',
  ChangeParameterSuccess = '[Audio Signal Chain] Change Parameter Success',
  ChangeChoiceParameter = '[Audio Signal Chain] Change Choice Parameter',
  ChangeChoiceParameterSuccess = '[Audio Signal Chain] Change Choice Parameter Success',
  ConnectModules = '[Audio Signal Chain] Connect Modules',
  ConnectModulesSuccess = '[Audio Signal Chain] Connect Modules Success',
  DisconnectModules = '[Audio Signal Chain] Disconnect Modules',
  DisconnectModulesSuccess = '[Audio Signal Chain] Disconnect Modules Success',
  ConnectParameter = '[Audio Signal Chain] Connect Parameter',
  ConnectParameterSuccess = '[Audio Signal Chain] Connect Parameter Success',
  DisconnectParameter = '[Audio Signal Chain] Disconnect Parameter',
  DisconnectParameterSuccess = '[Audio Signal Chain] Disconnect Parameter Success',
  CreateModule = '[Audio Signal Chain] Create Module',
  CreateModuleSuccess = '[Audio Signal Chain] Create Module Success',
  DestroyModule = '[Audio Signal Chain] Destroy Module',
  DestroyModuleSuccess = '[Audio Signal Chain] Destroy ModuleSuccess',
  CreateParameterSuccess = '[Audio Signal Chain] Create Parameter Success',
  CreateInputSuccess = '[Audio Signal Chain] Create Input Success',
  CreateOutputSuccess = '[Audio Signal Chain] Create Output Success',
  CreateChoiceParameterSuccess = '[Audio Signal Chain] Create Choice Parameter Success',
  ToggleSignalChainActive = '[Audio Signal Chain] Toggle SignalChain Output Active',
  ToggleSignalChainActiveSuccess = '[Audio Signal Chain] Toggle SignalChain Output Active Success',
  AddError = '[Audio Signal Chain] Add SignalChain Change Error',
  DismissError = '[Audio Signal Chain] Dismiss SignalChain Change Error',
  ClearErrors = '[Audio Signal Chain] Clear All SignalChain Change Errors',
  ToggleVisualizationActive = '[Audio Signal Chain] Toggle Visualization Active'
}

export class ResetSignalChain implements Action {
  readonly type = AudioSignalChainActionTypes.ResetSignalChain;
  constructor() {}
}

export class ResetSignalChainSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ResetSignalChainSuccess;
  constructor(public signalChain: AudioSignalChainState) {}
}

export class LoadSignalChainState implements Action {
  readonly type = AudioSignalChainActionTypes.LoadSignalChainState;
  constructor(public signalChain: AudioSignalChainState) {}
}

export class LoadSignalChainStateFailure implements Action {
  readonly type = AudioSignalChainActionTypes.LoadSignalChainStateFailure;
  constructor(public reason: string) {}
}

export class ChangeParameter implements Action {
  readonly type = AudioSignalChainActionTypes.ChangeParameter;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ChangeParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ChangeParameterSuccess;
  constructor(public payload: ChangeParameterEvent) {}
}

export class ChangeChoiceParameter implements Action {
  readonly type = AudioSignalChainActionTypes.ChangeChoiceParameter;
  constructor(public payload: ChangeChoiceEvent) {}
}

export class ChangeChoiceParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ChangeChoiceParameterSuccess;
  constructor(public payload: ChangeChoiceEvent) {}
}

export class ConnectModules implements Action {
  readonly type = AudioSignalChainActionTypes.ConnectModules;

  constructor(public payload: ConnectModulesEvent) {}
}

export class ConnectModulesSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ConnectModulesSuccess;

  constructor(public payload: ConnectModulesEvent) {}
}
export class DisconnectModules implements Action {
  readonly type = AudioSignalChainActionTypes.DisconnectModules;

  constructor(public payload: ConnectModulesEvent) {}
}

export class DisconnectModulesSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.DisconnectModulesSuccess;

  constructor(public payload: ConnectModulesEvent) {}
}
export class ConnectParameter implements Action {
  readonly type = AudioSignalChainActionTypes.ConnectParameter;

  constructor(public payload: ConnectParameterEvent) {}
}

export class ConnectParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ConnectParameterSuccess;

  constructor(public payload: ConnectParameterEvent) {}
}
export class DisconnectParameter implements Action {
  readonly type = AudioSignalChainActionTypes.DisconnectParameter;

  constructor(public payload: ConnectParameterEvent) {}
}

export class DisconnectParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.DisconnectParameterSuccess;

  constructor(public payload: ConnectParameterEvent) {}
}

export class CreateModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateModule;

  constructor(public payload: CreateModuleEvent) {}
}

export class CreateModuleSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateModuleSuccess;

  constructor(public payload: AudioModule) {}
}

export class CreateParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateParameterSuccess;

  constructor(public payload: Parameter) {}
}
export class CreateInputSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateInputSuccess;

  constructor(public payload: AudioModuleInput) {}
}
export class CreateOutputSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateOutputSuccess;

  constructor(public payload: AudioModuleOutput) {}
}
export class CreateChoiceParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateChoiceParameterSuccess;

  constructor(public payload: ChoiceParameter) {}
}

export class ToggleSignalChainActive implements Action {
  readonly type = AudioSignalChainActionTypes.ToggleSignalChainActive;

  constructor(public payload: boolean) {}
}
export class ToggleSignalChainActiveSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ToggleSignalChainActiveSuccess;

  constructor(public payload: boolean) {}
}

export class ToggleVisualizationActive implements Action {
  readonly type = AudioSignalChainActionTypes.ToggleVisualizationActive;

  constructor(public payload: ChangeVisualizationActiveEvent) {}
}

export class DestroyModule implements Action {
  readonly type = AudioSignalChainActionTypes.DestroyModule;

  constructor(public moduleId: string) {}
}

export class DestroyModuleSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.DestroyModuleSuccess;

  constructor(public moduleId: string) {}
}

export class AddError implements Action {
  readonly type = AudioSignalChainActionTypes.AddError;

  constructor(public error: SignalChainError) {}
}

export class DismissError implements Action {
  readonly type = AudioSignalChainActionTypes.DismissError;

  constructor(public id: string) {}
}

export class ClearErrors implements Action {
  readonly type = AudioSignalChainActionTypes.ClearErrors;

  constructor() {}
}

export type AudioSignalChainAction =
  | ResetSignalChain
  | ResetSignalChainSuccess
  | LoadSignalChainState
  | LoadSignalChainStateFailure
  | ChangeParameter
  | ChangeParameterSuccess
  | ChangeChoiceParameter
  | ChangeChoiceParameterSuccess
  | ConnectModules
  | ConnectModulesSuccess
  | DisconnectModules
  | DisconnectModulesSuccess
  | ConnectParameter
  | ConnectParameterSuccess
  | DisconnectParameter
  | DisconnectParameterSuccess
  | CreateModule
  | CreateModuleSuccess
  | CreateParameterSuccess
  | CreateInputSuccess
  | CreateOutputSuccess
  | CreateChoiceParameterSuccess
  | ToggleSignalChainActive
  | ToggleSignalChainActiveSuccess
  | ToggleVisualizationActive
  | DestroyModule
  | DestroyModuleSuccess
  | AddError
  | DismissError
  | ClearErrors;
