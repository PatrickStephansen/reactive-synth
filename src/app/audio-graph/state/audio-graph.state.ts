import { Parameter } from '../model/parameter';
import { AudioNode } from '../model/audio-node';
import { Visualization } from '../model/visualization';
import { ChoiceParameter } from '../model/choice-parameter';
import { GraphError } from '../model/graph-error';

export interface AudioGraphState {
  nodes: AudioNode[];
  parameters: Parameter[];
  choiceParameters: ChoiceParameter[];
  visualizations: Visualization[];
  muted: boolean;
  errors: GraphError[];
}
