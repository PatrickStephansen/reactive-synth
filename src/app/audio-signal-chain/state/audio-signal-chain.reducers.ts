import { createReducer, on } from '@ngrx/store';

import { audioSignalActions } from './audio-signal-chain.actions';
import { AudioSignalChainState } from './audio-signal-chain.state';
import { setSignalChainSuccess } from './reducer-functions/set-signal-chain-state';

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

export const reducer = createReducer(
  initialState,
  on(audioSignalActions.resetSignalChainSuccess, setSignalChainSuccess),
  on(audioSignalActions.changeParameterSuccess, (state: AudioSignalChainState, { parameter }) => {
    const updatedParameters = state.parameters.map(p =>
      p.moduleId === parameter.moduleId && p.name === parameter.parameterName
        ? { ...p, value: parameter.value }
        : p
    );
    return { ...state, parameters: updatedParameters };
  }),
  on(
    audioSignalActions.changeChoiceParameterSuccess,
    (state: AudioSignalChainState, { choice }) => {
      const updatedParameters = state.choiceParameters.map(c =>
        c.moduleId === choice.moduleId && c.name === choice.parameterName
          ? { ...c, selection: choice.value }
          : c
      );
      return { ...state, choiceParameters: updatedParameters };
    }
  ),
  on(audioSignalActions.connectModulesSuccess, (state: AudioSignalChainState, { connection }) => {
    const updatedInputs = state.inputs.map(i =>
      i.moduleId === connection.destinationId && i.name === connection.destinationInputName
        ? {
            ...i,
            sources: [
              ...i.sources,
              {
                moduleId: connection.sourceId,
                name: connection.sourceOutputName
              }
            ]
          }
        : i
    );
    return { ...state, inputs: updatedInputs };
  }),
  on(
    audioSignalActions.disconnectModulesSuccess,
    (state: AudioSignalChainState, { connection }) => {
      const updatedInputs = state.inputs.map(i =>
        i.moduleId === connection.destinationId && i.name === connection.destinationInputName
          ? {
              ...i,
              sources: i.sources.filter(
                s => !(s.moduleId === connection.sourceId && s.name === connection.sourceOutputName)
              )
            }
          : i
      );
      return { ...state, inputs: updatedInputs };
    }
  ),
  on(audioSignalActions.connectParameterSuccess, (state: AudioSignalChainState, { connection }) => {
    const updatedParameters = state.parameters.map(p =>
      p.moduleId === connection.destinationModuleId &&
      p.name === connection.destinationParameterName
        ? {
            ...p,
            sources: [
              ...p.sources,
              {
                moduleId: connection.sourceModuleId,
                name: connection.sourceOutputName
              }
            ]
          }
        : p
    );
    return { ...state, parameters: updatedParameters };
  }),
  on(
    audioSignalActions.disconnectParameterSuccess,
    (state: AudioSignalChainState, { connection }) => {
      const updatedParameters = state.parameters.map(p =>
        p.moduleId === connection.destinationModuleId &&
        p.name === connection.destinationParameterName
          ? {
              ...p,
              sources: p.sources.filter(
                s =>
                  !(
                    connection.sourceModuleId === s.moduleId &&
                    connection.sourceOutputName === s.name
                  )
              )
            }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
  ),
  on(audioSignalActions.createModuleSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    modules: [...state.modules, action.module]
  })),
  on(audioSignalActions.createParameterSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    parameters: [...state.parameters, action.parameter]
  })),
  on(audioSignalActions.createChoiceParameterSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    choiceParameters: [...state.choiceParameters, action.choice]
  })),
  on(audioSignalActions.createInputSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    inputs: [...state.inputs, action.input]
  })),
  on(audioSignalActions.createOutputSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    outputs: [...state.outputs, action.output]
  })),
  on(audioSignalActions.toggleSignalChainActiveSuccess, (state: AudioSignalChainState, action) => ({
    ...state,
    muted: !action.isActive
  })),
  on(audioSignalActions.destroyModuleSuccess, (state: AudioSignalChainState, { moduleId }) => {
    const remainingModules = state.modules.filter(m => m.id !== moduleId);
    const remainingOutputs = state.outputs.filter(o => o.moduleId !== moduleId);
    const remainingInputs = state.inputs
      .filter(i => i.moduleId !== moduleId)
      .map(i => ({
        ...i,
        sources: i.sources.filter(s => s.moduleId !== moduleId)
      }));
    const remainingParameters = state.parameters
      .filter(p => p.moduleId !== moduleId)
      .map(p => ({
        ...p,
        sources: p.sources.filter(s => s.moduleId !== moduleId)
      }));
    const remainingChoiceParameters = state.choiceParameters.filter(p => p.moduleId !== moduleId);

    return {
      ...state,
      modules: remainingModules,
      inputs: remainingInputs,
      outputs: remainingOutputs,
      parameters: remainingParameters,
      choiceParameters: remainingChoiceParameters
    };
  }),
  on(audioSignalActions.clearErrors, (state: AudioSignalChainState) => ({
    ...state,
    errors: []
  })),
  on(audioSignalActions.addError, (state: AudioSignalChainState, { error }) => ({
    ...state,
    errors: [...state.errors, error]
  })),
  on(audioSignalActions.dismissError, (state: AudioSignalChainState, action) => {
    const remainingErrors = state.errors.filter(e => e.id !== action.id);
    return { ...state, errors: remainingErrors };
  }),
  on(audioSignalActions.toggleVisualizationActive, (state: AudioSignalChainState, { change }) => {
    const visualizations = state.visualizations.map(v =>
      v.moduleId === change.moduleId && v.name === change.name ? { ...v, isActive: change.show } : v
    );
    return { ...state, visualizations };
  })
);
