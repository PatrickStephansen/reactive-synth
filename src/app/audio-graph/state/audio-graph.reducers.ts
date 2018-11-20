import { AudioGraphState } from './audio-graph.state';
import { AudioGraphActionTypes, AudioGraphAction } from './audio-graph.actions';

const initialState = {
  id: 'default-graph',
  nodes: [
    {
      id: 'speakers-output',
      nodeType: 'graph output',
      numberInputs: 1,
      numberOutputs: 0,
      sourceIds: []
    }
  ],
  parameters: [],
  muted: true
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
    case AudioGraphActionTypes.CreateNodeSuccess: {
      return { ...state, nodes: [...state.nodes, action.payload] };
    }
    case AudioGraphActionTypes.CreateParameterSuccess: {
      return { ...state, parameters: [...state.parameters, action.payload] };
    }
    case AudioGraphActionTypes.ToggleGraphActiveSuccess: {
      return { ...state, muted: !action.payload };
    }
    default:
      return state;
  }
}
