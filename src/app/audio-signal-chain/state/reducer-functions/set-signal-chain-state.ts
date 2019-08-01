import { AudioSignalChainState } from '../audio-signal-chain.state';

export const setSignalChainSuccess = (state: AudioSignalChainState, action) => ({
  ...action.signalChain
});
