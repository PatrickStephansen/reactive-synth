import { Parameter } from '../parameter';
import { AudioNode } from '../audio-node';
import { Visualization } from '../visualization';

export interface AudioGraphState {
  nodes: AudioNode[];
  parameters: Parameter[];
  visualizations: Visualization[];
  muted: boolean;
}
