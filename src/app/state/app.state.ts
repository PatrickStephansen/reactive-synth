import { AudioSignalChainState } from '../audio-signal-chain/state/audio-signal-chain.state';

export interface State {
  signalChain: AudioSignalChainState;
  app: AppState;
}

export interface AppState {
  showHelp: boolean;
}
