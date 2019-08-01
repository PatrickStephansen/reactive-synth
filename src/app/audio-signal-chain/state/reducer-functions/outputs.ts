import { AudioSignalChainState } from '../audio-signal-chain.state';

export const addOutput = (state: AudioSignalChainState, action) => ({
  ...state,
  outputs: [...state.outputs, action.output]
});
