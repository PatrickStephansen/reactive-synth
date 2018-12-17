import { NodeSignalStage } from './node-signal-stage';

export interface Visualization {
  nodeId: string;
  name: string;
  dataLength: number;
  visualizationStage: NodeSignalStage;
  visualizationType: string;
  getVisualizationData(data: Uint8Array): void;
}
