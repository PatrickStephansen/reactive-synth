import { AudioGraphState } from './audio-graph.state';
import { AudioGraphActionTypes, AudioGraphAction } from './audio-graph.actions';

const initialState = {
  nodes: [],
  parameters: [],
  choiceParameters: [],
  visualizations: [],
  muted: false,
  errors: []
};

export function reducer(
  state: AudioGraphState = initialState,
  action: AudioGraphAction
) {
  switch (action.type) {
    case AudioGraphActionTypes.ResetGraphSuccess: {
      return { ...action.graph };
    }
    case AudioGraphActionTypes.ChangeParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.nodeId === action.payload.nodeId &&
        p.name === action.payload.parameterName
          ? { ...p, value: action.payload.value }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioGraphActionTypes.ChangeChoiceParameterSuccess: {
      const updatedParameters = state.choiceParameters.map(c =>
        c.nodeId === action.payload.nodeId &&
        c.name === action.payload.parameterName
          ? { ...c, value: action.payload.value }
          : c
      );
      return { ...state, choiceParameters: updatedParameters };
    }
    case AudioGraphActionTypes.ConnectNodesSuccess: {
      const updatedNodes = state.nodes.map(n =>
        n.id === action.payload.destinationId
          ? { ...n, sourceIds: [...n.sourceIds, action.payload.sourceId] }
          : n
      );
      return { ...state, nodes: updatedNodes };
    }
    case AudioGraphActionTypes.DisconnectNodesSuccess: {
      const updatedNodes = state.nodes.map(n =>
        n.id === action.payload.destinationId
          ? {
              ...n,
              sourceIds: n.sourceIds.filter(s => s !== action.payload.sourceId)
            }
          : n
      );
      return { ...state, nodes: updatedNodes };
    }
    case AudioGraphActionTypes.ConnectParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.nodeId === action.payload.destinationNodeId &&
        p.name === action.payload.destinationParameterName
          ? { ...p, sourceIds: [...p.sourceIds, action.payload.sourceNodeId] }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioGraphActionTypes.DisconnectParameterSuccess: {
      const updatedParameters = state.parameters.map(p =>
        p.nodeId === action.payload.destinationNodeId &&
        p.name === action.payload.destinationParameterName
          ? {
              ...p,
              sourceIds: p.sourceIds.filter(
                s => action.payload.sourceNodeId !== s
              )
            }
          : p
      );
      return { ...state, parameters: updatedParameters };
    }
    case AudioGraphActionTypes.CreateNodeSuccess: {
      return { ...state, nodes: [...state.nodes, action.payload] };
    }
    case AudioGraphActionTypes.CreateParameterSuccess: {
      return { ...state, parameters: [...state.parameters, action.payload] };
    }
    case AudioGraphActionTypes.CreateChoiceParameterSuccess: {
      return {
        ...state,
        choiceParameters: [...state.choiceParameters, action.payload]
      };
    }
    case AudioGraphActionTypes.ToggleGraphActiveSuccess: {
      return { ...state, muted: !action.payload };
    }
    case AudioGraphActionTypes.DestroyNodeSuccess: {
      const remainingNodes = state.nodes
        .filter(n => n.id !== action.nodeId)
        .map(n => ({
          ...n,
          sourceIds: n.sourceIds.filter(s => s !== action.nodeId)
        }));
      const remainingParameters = state.parameters
        .filter(p => p.nodeId !== action.nodeId)
        .map(p => ({
          ...p,
          sourceIds: p.sourceIds.filter(s => s !== action.nodeId)
        }));
      const remainingChoiceParameters = state.choiceParameters.filter(
        p => p.nodeId !== action.nodeId
      );

      return {
        ...state,
        nodes: remainingNodes,
        parameters: remainingParameters,
        choiceParameters: remainingChoiceParameters
      };
    }
    case AudioGraphActionTypes.ClearErrors: {
      return { ...state, errors: [] };
    }
    case AudioGraphActionTypes.AddError: {
      return { ...state, errors: [...state.errors, action.error] };
    }
    case AudioGraphActionTypes.DismissError: {
      const remainingErrors = state.errors.filter(e => e.id !== action.id);
      return { ...state, errors: remainingErrors };
    }
    default:
      return state;
  }
}
