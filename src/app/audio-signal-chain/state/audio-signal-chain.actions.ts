import { createAction, props } from '@ngrx/store';
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
import { ReorderModulesEvent } from '../model/reorder-modules-event';
import { ChangeModuleNameEvent } from '../model/change-module-name-event';
import { ViewMode } from '../model/view-mode';
import { ActivateControlSurfaceEvent } from '../model/activate-control-surface-event';
import { ChangeParameterBoundsEvent } from '../model/change-parameter-bounds-event';
import { ControlSurfaceValueChangeEvent } from '../model/control-surface-value-change-event';
import { ControlSurfaceRangeChangeEvent } from '../model/control-surface-range-change-event';
import { Visualization } from '../model/visualization/visualization';

export enum AudioSignalChainActionTypes {
  ResetSignalChain = '[Audio Signal Chain] Reset Signal Chain',
  ResetSignalChainSuccess = '[Audio Signal Chain] Reset SignalChain Success',
  LoadSignalChainState = '[Audio Signal Chain] Load State',
  LoadSignalChainStateFailure = '[Audio Signal Chain] Load State Failure',
  ChangeParameter = '[Audio Signal Chain] Change Parameter',
  ChangeParameterSuccess = '[Audio Signal Chain] Change Parameter Success',
  ChangeParameterBounds = '[Audio Signal Chain] Change Parameter Bounds',
  ChangeChoiceParameter = '[Audio Signal Chain] Change Choice Parameter',
  ChangeChoiceParameterSuccess = '[Audio Signal Chain] Change Choice Parameter Success',
  ConnectModules = '[Audio Signal Chain] Connect Modules',
  ConnectModulesSuccess = '[Audio Signal Chain] Connect Modules Success',
  DisconnectModules = '[Audio Signal Chain] Disconnect Modules',
  DisconnectModulesSuccess = '[Audio Signal Chain] Disconnect Modules Success',
  ChangeModuleName = '[Audio Signal Chain] Change Module Name',
  ConnectParameter = '[Audio Signal Chain] Connect Parameter',
  ConnectParameterSuccess = '[Audio Signal Chain] Connect Parameter Success',
  DisconnectParameter = '[Audio Signal Chain] Disconnect Parameter',
  DisconnectParameterSuccess = '[Audio Signal Chain] Disconnect Parameter Success',
  CreateModule = '[Audio Signal Chain] Create Module',
  CreateModuleSuccess = '[Audio Signal Chain] Create Module Success',
  DestroyModule = '[Audio Signal Chain] Destroy Module',
  DestroyModuleSuccess = '[Audio Signal Chain] Destroy Module Success',
  ReorderModules = '[Audio Signal Chain] Reorder Modules',
  CreateParameterSuccess = '[Audio Signal Chain] Create Parameter Success',
  CreateInputSuccess = '[Audio Signal Chain] Create Input Success',
  CreateOutputSuccess = '[Audio Signal Chain] Create Output Success',
  CreateChoiceParameterSuccess = '[Audio Signal Chain] Create Choice Parameter Success',
  CreateVisualizationSuccess = '[Audio Signal Chain] Create Visualiztion Success',
  ToggleSignalChainActive = '[Audio Signal Chain] Toggle SignalChain Output Active',
  ToggleSignalChainActiveSuccess = '[Audio Signal Chain] Toggle SignalChain Output Active Success',
  AddError = '[Audio Signal Chain] Add SignalChain Change Error',
  DismissError = '[Audio Signal Chain] Dismiss SignalChain Change Error',
  ClearErrors = '[Audio Signal Chain] Clear All SignalChain Change Errors',
  ToggleVisualizationActive = '[Audio Signal Chain] Toggle Visualization Active',
  SetViewMode = '[Audio Signal Chain] Set View Mode',
  ActivateControlSurface = '[Audio Signal Chain] Activate Control Surface',
  UpdateControlSurfaceCoordinates = '[Audio Signal Chain] Update Control Surface Coordinates',
  UpdateControlSurfaceRange = '[Audio Signal Chain] Update Control Surface Range'
}

export const audioSignalActions = {
  resetSignalChain: createAction(AudioSignalChainActionTypes.ResetSignalChain),
  resetSignalChainSuccess: createAction(
    AudioSignalChainActionTypes.ResetSignalChainSuccess,
    props<{ signalChain: AudioSignalChainState }>()
  ),
  loadSignalChainState: createAction(
    AudioSignalChainActionTypes.LoadSignalChainState,
    props<{ signalChain: AudioSignalChainState }>()
  ),
  loadSignalChainStateFailure: createAction(
    AudioSignalChainActionTypes.LoadSignalChainStateFailure,
    props<{ reason: string }>()
  ),
  changeParameter: createAction(
    AudioSignalChainActionTypes.ChangeParameter,
    props<{ parameter: ChangeParameterEvent }>()
  ),
  changeParameterSuccess: createAction(
    AudioSignalChainActionTypes.ChangeParameterSuccess,
    props<{ parameter: ChangeParameterEvent }>()
  ),
  changeParameterBounds: createAction(
    AudioSignalChainActionTypes.ChangeParameterBounds,
    props<{ change: ChangeParameterBoundsEvent }>()
  ),
  changeChoiceParameter: createAction(
    AudioSignalChainActionTypes.ChangeChoiceParameter,
    props<{ choice: ChangeChoiceEvent }>()
  ),
  changeChoiceParameterSuccess: createAction(
    AudioSignalChainActionTypes.ChangeChoiceParameterSuccess,
    props<{ choice: ChangeChoiceEvent }>()
  ),
  connectModules: createAction(
    AudioSignalChainActionTypes.ConnectModules,
    props<{ connection: ConnectModulesEvent }>()
  ),
  connectModulesSuccess: createAction(
    AudioSignalChainActionTypes.ConnectModulesSuccess,
    props<{ connection: ConnectModulesEvent }>()
  ),
  disconnectModules: createAction(
    AudioSignalChainActionTypes.DisconnectModules,
    props<{ connection: ConnectModulesEvent }>()
  ),
  disconnectModulesSuccess: createAction(
    AudioSignalChainActionTypes.DisconnectModulesSuccess,
    props<{ connection: ConnectModulesEvent }>()
  ),
  reorderModules: createAction(
    AudioSignalChainActionTypes.ReorderModules,
    props<{ orderChange: ReorderModulesEvent }>()
  ),
  changeModuleName: createAction(
    AudioSignalChainActionTypes.ChangeModuleName,
    props<{ nameChange: ChangeModuleNameEvent }>()
  ),
  connectParameter: createAction(
    AudioSignalChainActionTypes.ConnectParameter,
    props<{ connection: ConnectParameterEvent }>()
  ),
  connectParameterSuccess: createAction(
    AudioSignalChainActionTypes.ConnectParameterSuccess,
    props<{ connection: ConnectParameterEvent }>()
  ),
  disconnectParameter: createAction(
    AudioSignalChainActionTypes.DisconnectParameter,
    props<{ connection: ConnectParameterEvent }>()
  ),
  disconnectParameterSuccess: createAction(
    AudioSignalChainActionTypes.DisconnectParameterSuccess,
    props<{ connection: ConnectParameterEvent }>()
  ),
  createModule: createAction(
    AudioSignalChainActionTypes.CreateModule,
    props<{ module: CreateModuleEvent }>()
  ),
  createModuleSuccess: createAction(
    AudioSignalChainActionTypes.CreateModuleSuccess,
    props<{ module: AudioModule }>()
  ),
  createParameterSuccess: createAction(
    AudioSignalChainActionTypes.CreateParameterSuccess,
    props<{ parameter: Parameter }>()
  ),
  createInputSuccess: createAction(
    AudioSignalChainActionTypes.CreateInputSuccess,
    props<{ input: AudioModuleInput }>()
  ),
  createOutputSuccess: createAction(
    AudioSignalChainActionTypes.CreateOutputSuccess,
    props<{ output: AudioModuleOutput }>()
  ),
  createChoiceParameterSuccess: createAction(
    AudioSignalChainActionTypes.CreateChoiceParameterSuccess,
    props<{ choice: ChoiceParameter }>()
  ),
  createVisualizationSuccess: createAction(
    AudioSignalChainActionTypes.CreateVisualizationSuccess,
    props<{visualization: Visualization}>()
  ),
  toggleSignalChainActive: createAction(
    AudioSignalChainActionTypes.ToggleSignalChainActive,
    props<{ isActive: boolean }>()
  ),
  toggleSignalChainActiveSuccess: createAction(
    AudioSignalChainActionTypes.ToggleSignalChainActiveSuccess,
    props<{ isActive: boolean }>()
  ),
  toggleVisualizationActive: createAction(
    AudioSignalChainActionTypes.ToggleVisualizationActive,
    props<{ change: ChangeVisualizationActiveEvent }>()
  ),
  destroyModule: createAction(
    AudioSignalChainActionTypes.DestroyModule,
    props<{ moduleId: string }>()
  ),
  destroyModuleSuccess: createAction(
    AudioSignalChainActionTypes.DestroyModuleSuccess,
    props<{ moduleId: string }>()
  ),
  addError: createAction(
    AudioSignalChainActionTypes.AddError,
    props<{ error: SignalChainError }>()
  ),
  dismissError: createAction(AudioSignalChainActionTypes.DismissError, props<{ id: string }>()),
  clearErrors: createAction(AudioSignalChainActionTypes.ClearErrors),
  setViewMode: createAction(
    AudioSignalChainActionTypes.SetViewMode,
    props<{ viewMode: ViewMode }>()
  ),
  activateControlSurface: createAction(
    AudioSignalChainActionTypes.ActivateControlSurface,
    props<{ activateControlSurfaceEvent: ActivateControlSurfaceEvent }>()
  ),
  updateControlSurfaceCoordinates: createAction(
    AudioSignalChainActionTypes.UpdateControlSurfaceCoordinates,
    props<{ change: ControlSurfaceValueChangeEvent }>()
  ),
  updateControlSurfaceRange: createAction(
    AudioSignalChainActionTypes.UpdateControlSurfaceRange,
    props<{ change: ControlSurfaceRangeChangeEvent }>()
  )
};
