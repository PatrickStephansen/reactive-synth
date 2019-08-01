import { AudioSignalChainState } from '../audio-signal-chain.state';

export const addInput = (state: AudioSignalChainState, action) => ({
  ...state,
  inputs: [...state.inputs, action.input]
});
