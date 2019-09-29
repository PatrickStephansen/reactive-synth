import { Parameter } from '../model/parameter';
import { AudioModule } from '../model/audio-module';
import { Visualization } from '../model/visualization/visualization';
import { ChoiceParameter } from '../model/choice-parameter';
import { SignalChainError } from '../model/signal-chain-error';
import { AudioModuleInput } from '../model/audio-module-input';
import { AudioModuleOutput } from '../model/audio-module-output';
import { ViewMode } from '../model/view-mode';

export interface AudioSignalChainState {
  modules: AudioModule[];
  inputs: AudioModuleInput[];
  outputs: AudioModuleOutput[];
  parameters: Parameter[];
  choiceParameters: ChoiceParameter[];
  visualizations: Visualization[];
  viewMode: ViewMode;
  activeControlSurfaceId?: string;
  muted: boolean;
  errors: SignalChainError[];
}
