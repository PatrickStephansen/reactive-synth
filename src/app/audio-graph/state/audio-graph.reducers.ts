import { AudioGraphState } from './audio-graph.state';
import { AudioGraphActionTypes, AudioGraphAction } from './audio-graph.actions';

const initialState = {
  id: 'default-graph',
  nodes: [
    {
      id: 'default-output',
      nodeType: 'graph output',
      numberInputs: 1,
      numberOutputs: 0,
      sourceIds: []
    }
  ],
  parameters: []
};

export function reducer(
  state: AudioGraphState = initialState,
  action: AudioGraphAction
) {
  switch (action.type) {
    case AudioGraphActionTypes.ResetGraph: {
      return initialState;
    }
    default:
      return state;
  }
}
