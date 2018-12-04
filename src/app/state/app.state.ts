import { AudioGraphState } from '../audio-graph/state/audio-graph.state';

export interface State {
  graph: AudioGraphState;
  app: AppState;
}

export interface AppState {
  showHelp: boolean;
}
