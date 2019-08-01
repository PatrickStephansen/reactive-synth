import { AudioSignalChainState } from '../audio-signal-chain.state';

export const setSignalChainSuccess = (state: AudioSignalChainState, action) => ({
  ...action.signalChain
});

export const setSignalChainActive = (state: AudioSignalChainState, action) => ({
  ...state,
  muted: !action.isActive
});
