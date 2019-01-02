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

export enum AudioSignalChainActionTypes {
  ResetSignalChain = '[Audio SignalChain] Reset SignalChain',
  ResetSignalChainSuccess = '[Audio SignalChain] Reset SignalChain Success',
  ChangeParameter = '[Audio SignalChain] Change Parameter',
  ChangeParameterSuccess = '[Audio SignalChain] Change Parameter Success',
  ChangeChoiceParameter = '[Audio SignalChain] Change Choice Parameter',
  ChangeChoiceParameterSuccess = '[Audio SignalChain] Change Choice Parameter Success',
  ConnectModules = '[Audio SignalChain] Connect Modules',
  ConnectModulesSuccess = '[Audio SignalChain] Connect Modules Success',
  DisconnectModules = '[Audio SignalChain] Disconnect Modules',
  DisconnectModulesSuccess = '[Audio SignalChain] Disconnect Modules Success',
  ConnectParameter = '[Audio SignalChain] Connect Parameter',
  ConnectParameterSuccess = '[Audio SignalChain] Connect Parameter Success',
  DisconnectParameter = '[Audio SignalChain] Disconnect Parameter',
  DisconnectParameterSuccess = '[Audio SignalChain] Disconnect Parameter Success',
  CreateOscillator = '[Audio SignalChain] Create Oscillator',
  CreateGainModule = '[Audio SignalChain] Create Gain Module',
  CreateDelayModule = '[Audio SignalChain] Create Delay Module',
  CreateFilterModule = '[Audio SignalChain] Create Filter Module',
  CreateDistortionModule = '[Audio SignalChain] Create Distortion Module',
  CreateRectifierModule = '[Audio SignalChain] Create Rectifier Module',
  CreateConstantSource = '[Audio SignalChain] Create Constant Source',
  CreateModuleSuccess = '[Audio SignalChain] Create Module Success',
  DestroyModule = '[Audio SignalChain] Destroy Module',
  DestroyModuleSuccess = '[Audio SignalChain] Destroy ModuleSuccess',
  CreateParameterSuccess = '[Audio SignalChain] Create Parameter Success',
  CreateChoiceParameterSuccess = '[Audio SignalChain] Create Choice Parameter Success',
  ToggleSignalChainActive = '[Audio SignalChain] Toggle SignalChain Output Active',
  ToggleSignalChainActiveSuccess = '[Audio SignalChain] Toggle SignalChain Output Active Success',
  AddError = '[Audio SignalChain] Add SignalChain Change Error',
  DismissError = '[Audio SignalChain] Dismiss SignalChain Change Error',
  ClearErrors = '[Audio SignalChain] Clear All SignalChain Change Errors',
  ToggleVisualizationActive = '[Audio SignalChain] Toggle Visualization Active'
}

export class ResetSignalChain implements Action {
  readonly type = AudioSignalChainActionTypes.ResetSignalChain;
  constructor() {}
}
export class ResetSignalChainSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.ResetSignalChainSuccess;
  constructor(public signalChain: AudioSignalChainState) {}
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

export class CreateOscillator implements Action {
  readonly type = AudioSignalChainActionTypes.CreateOscillator;

  constructor() {}
}

export class CreateGainModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateGainModule;

  constructor() {}
}

export class CreateDistortionModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateDistortionModule;

  constructor() {}
}

export class CreateRectifierModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateRectifierModule;

  constructor() {}
}

export class CreateConstantSource implements Action {
  readonly type = AudioSignalChainActionTypes.CreateConstantSource;

  constructor() {}
}

export class CreateDelayModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateDelayModule;

  constructor() {}
}

export class CreateFilterModule implements Action {
  readonly type = AudioSignalChainActionTypes.CreateFilterModule;

  constructor() {}
}

export class CreateModuleSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateModuleSuccess;

  constructor(public payload: AudioModule) {}
}

export class CreateParameterSuccess implements Action {
  readonly type = AudioSignalChainActionTypes.CreateParameterSuccess;

  constructor(public payload: Parameter) {}
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
  | CreateOscillator
  | CreateModuleSuccess
  | CreateParameterSuccess
  | CreateChoiceParameterSuccess
  | ToggleSignalChainActive
  | ToggleSignalChainActiveSuccess
  | ToggleVisualizationActive
  | CreateGainModule
  | CreateDistortionModule
  | CreateRectifierModule
  | CreateDelayModule
  | CreateFilterModule
  | CreateConstantSource
  | DestroyModule
  | DestroyModuleSuccess
  | AddError
  | DismissError
  | ClearErrors;
