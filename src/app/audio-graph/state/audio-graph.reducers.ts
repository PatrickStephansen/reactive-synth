import { AudioGraphState } from './audio-graph.state';
import {
  AudioGraphActionTypes,
  AudioGraphAction,
  DestroyNodeSuccess
} from './audio-graph.actions';
import { filter } from 'rxjs/operators';

const initialState = {
  id: 'default-graph',
  nodes: [
    {
      id: 'speakers-output',
      nodeType: 'graph output',
      numberInputs: 1,
      numberOutputs: 0,
      sourceIds: [],
      canDelete: false
    }
  ],
  parameters: [],
  muted: false
};

export function reducer(
  state: AudioGraphState = initialState,
  action: AudioGraphAction
) {
  switch (action.type) {
    case AudioGraphActionTypes.ResetGraph: {
      return initialState;
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
    case AudioGraphActionTypes.CreateNodeSuccess: {
      return { ...state, nodes: [...state.nodes, action.payload] };
    }
    case AudioGraphActionTypes.CreateParameterSuccess: {
      return { ...state, parameters: [...state.parameters, action.payload] };
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
      const remainingParameters = state.parameters.filter(
        p => p.nodeId !== action.nodeId
      );
      return {
        ...state,
        nodes: remainingNodes,
        parameters: remainingParameters
      };
    }
    default:
      return state;
  }
}
