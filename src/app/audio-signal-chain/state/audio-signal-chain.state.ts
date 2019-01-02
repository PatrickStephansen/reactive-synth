import { Parameter } from '../model/parameter';
import { AudioModule } from '../model/audio-module';
import { Visualization } from '../model/visualization/visualization';
import { ChoiceParameter } from '../model/choice-parameter';
import { SignalChainError } from '../model/signal-chain-error';

export interface AudioSignalChainState {
  modules: AudioModule[];
  parameters: Parameter[];
  choiceParameters: ChoiceParameter[];
  visualizations: Visualization[];
  muted: boolean;
  errors: SignalChainError[];
}
