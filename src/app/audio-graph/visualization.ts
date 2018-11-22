import { NodeSignalStage } from './node-signal-stage';

export interface Visualization {
  nodeId: string;
  visualizationStage: NodeSignalStage;
  dataLength: number;
  getVisualizationData(data: Float32Array): Float32Array;
}
