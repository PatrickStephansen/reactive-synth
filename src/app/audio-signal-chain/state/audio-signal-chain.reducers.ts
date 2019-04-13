import { AudioSignalChainState } from './audio-signal-chain.state';
import { AudioSignalChainActionTypes, AudioSignalChainAction } from './audio-signal-chain.actions';

const initialState = {
  modules: [],
  parameters: [],
  choiceParameters: [],
  visualizations: [],
  muted: false,
  errors: []
};

export function reducer(
  state: AudioSignalChainState = initialState,
  action: AudioSignalChainAction
) {
  switch (action.type) {
    case AudioSignalChainActionTypes.ResetSignalChainSuccess: {
      return { ...action.signalChain };
    }
    case AudioSignalChainActionTypes.ChangeParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.moduleId === action.payload.moduleId &&
        p.name === action.payload.parameterName
          ? { ...p, value: action.payload.value }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioSignalChainActionTypes.ChangeChoiceParameterSuccess: {
      const updatedParameters = state.choiceParameters.map(c =>
        c.moduleId === action.payload.moduleId &&
        c.name === action.payload.parameterName
          ? { ...c, selection: action.payload.value }
          : c
      );
      return { ...state, choiceParameters: updatedParameters };
    }
    case AudioSignalChainActionTypes.ConnectModulesSuccess: {
      const updatedModules = state.modules.map(n =>
        n.id === action.payload.destinationId
          ? { ...n, sourceIds: [...n.sourceIds, action.payload.sourceId] }
          : n
      );
      return { ...state, modules: updatedModules };
    }
    case AudioSignalChainActionTypes.DisconnectModulesSuccess: {
      const updatedModules = state.modules.map(n =>
        n.id === action.payload.destinationId
          ? {
              ...n,
              sourceIds: n.sourceIds.filter(s => s !== action.payload.sourceId)
            }
          : n
      );
      return { ...state, modules: updatedModules };
    }
    case AudioSignalChainActionTypes.ConnectParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.moduleId === action.payload.destinationModuleId &&
        p.name === action.payload.destinationParameterName
          ? { ...p, sourceIds: [...p.sourceIds, action.payload.sourceModuleId] }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioSignalChainActionTypes.DisconnectParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.moduleId === action.payload.destinationModuleId &&
        p.name === action.payload.destinationParameterName
          ? {
              ...p,
              sourceIds: p.sourceIds.filter(
                s => action.payload.sourceModuleId !== s
              )
            }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioSignalChainActionTypes.CreateModuleSuccess: {
      return { ...state, modules: [...state.modules, action.payload] };
    }
    case AudioSignalChainActionTypes.CreateParameterSuccess: {
      return { ...state, parameters: [...state.parameters, action.payload] };
    }
    case AudioSignalChainActionTypes.CreateChoiceParameterSuccess: {
      return {
        ...state,
        choiceParameters: [...state.choiceParameters, action.payload]
      };
    }
    case AudioSignalChainActionTypes.ToggleSignalChainActiveSuccess: {
      return { ...state, muted: !action.payload };
    }
    case AudioSignalChainActionTypes.DestroyModuleSuccess: {
      const remainingModules = state.modules
        .filter(n => n.id !== action.moduleId)
        .map(n => ({
          ...n,
          sourceIds: n.sourceIds.filter(s => s !== action.moduleId)
        }));
      const remainingParameters = state.parameters
        .filter(p => p.moduleId !== action.moduleId)
        .map(p => ({
          ...p,
          sourceIds: p.sourceIds.filter(s => s !== action.moduleId)
        }));
      const remainingChoiceParameters = state.choiceParameters.filter(
        p => p.moduleId !== action.moduleId
      );

      return {
        ...state,
        modules: remainingModules,
        parameters: remainingParameters,
        choiceParameters: remainingChoiceParameters
      };
    }
    case AudioSignalChainActionTypes.ClearErrors: {
      return { ...state, errors: [] };
    }
    case AudioSignalChainActionTypes.AddError: {
      return { ...state, errors: [...state.errors, action.error] };
    }
    case AudioSignalChainActionTypes.DismissError: {
      const remainingErrors = state.errors.filter(e => e.id !== action.id);
      return { ...state, errors: remainingErrors };
    }
    case AudioSignalChainActionTypes.ToggleVisualizationActive: {
      const visualizations = state.visualizations.map(v =>
        v.moduleId === action.payload.moduleId && v.name === action.payload.name
          ? { ...v, isActive: action.payload.show }
          : v
      );
      return { ...state, visualizations };
    }
    default:
      return state;
  }
}
