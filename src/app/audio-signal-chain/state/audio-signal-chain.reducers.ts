import { createReducer, on, Action } from '@ngrx/store';

import { audioSignalActions } from './audio-signal-chain.actions';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { setSignalChainSuccess, setSignalChainActive } from './reducer-functions/signal-chain';
import {
  addParameter,
  connectParameter,
  disconnectParameter,
  updateParameter
} from './reducer-functions/parameters';
import { addOutput } from './reducer-functions/outputs';
import { addInput } from './reducer-functions/inputs';
import { setVisualizationActive } from './reducer-functions/visualizations';
import { addError, clearErrors, removeError } from './reducer-functions/errors';
import { updateChoice, addChoice } from './reducer-functions/choices';
import {
  connectModules,
  disconnectModules,
  addModule,
  removeModule,
  changeModuleName
} from './reducer-functions/modules';

const initialState: AudioSignalChainState = {
  modules: [],
  inputs: [],
  outputs: [],
  parameters: [],
  choiceParameters: [],
  visualizations: [],
  muted: false,
  errors: []
};

export const realReducer = createReducer(
  initialState,
  on(audioSignalActions.resetSignalChainSuccess, setSignalChainSuccess),
  on(audioSignalActions.changeParameterSuccess, updateParameter),
  on(audioSignalActions.changeChoiceParameterSuccess, updateChoice),
  on(audioSignalActions.connectModulesSuccess, connectModules),
  on(audioSignalActions.disconnectModulesSuccess, disconnectModules),
  on(audioSignalActions.changeModuleName, changeModuleName),
  on(audioSignalActions.connectParameterSuccess, connectParameter),
  on(audioSignalActions.disconnectParameterSuccess, disconnectParameter),
  on(audioSignalActions.createModuleSuccess, addModule),
  on(audioSignalActions.createParameterSuccess, addParameter),
  on(audioSignalActions.createChoiceParameterSuccess, addChoice),
  on(audioSignalActions.createInputSuccess, addInput),
  on(audioSignalActions.createOutputSuccess, addOutput),
  on(audioSignalActions.toggleSignalChainActiveSuccess, setSignalChainActive),
  on(audioSignalActions.destroyModuleSuccess, removeModule),
  on(audioSignalActions.clearErrors, clearErrors),
  on(audioSignalActions.addError, addError),
  on(audioSignalActions.dismissError, removeError),
  on(audioSignalActions.toggleVisualizationActive, setVisualizationActive)
);

export function reducer(state: AudioSignalChainState, action: Action) {
  return realReducer(state, action);
}
