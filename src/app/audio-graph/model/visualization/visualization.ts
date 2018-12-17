import { NodeSignalStage } from '../node-signal-stage';
import { ScalingStrategy } from './scaling-strategy';

export interface Visualization {
  nodeId: string;
  name: string;
  dataLength: number;
  visualizationStage: NodeSignalStage;
  visualizationType: string;
  renderingStrategyPerAxis: ScalingStrategy[];
  isActive: boolean;
  getVisualizationData(data: Uint8Array): void;
}
