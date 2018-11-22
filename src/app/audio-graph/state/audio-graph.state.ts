import { Parameter } from '../model/parameter';
import { AudioNode } from '../model/audio-node';
import { Visualization } from '../model/visualization';

export interface AudioGraphState {
  nodes: AudioNode[];
  parameters: Parameter[];
  visualizations: Visualization[];
  muted: boolean;
}
