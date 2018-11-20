import { Parameter } from '../parameter';
import { AudioNode } from '../audio-node';

export interface AudioGraphState {
  id: string;
  nodes: AudioNode[];
  parameters: Parameter[];
  muted: boolean;
}
