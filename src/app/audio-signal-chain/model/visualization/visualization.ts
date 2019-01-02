import { ModuleSignalStage } from '../module-signal-stage';
import { ScalingStrategy } from './scaling-strategy';

export interface Visualization {
  moduleId: string;
  name: string;
  dataLength: number;
  visualizationStage: ModuleSignalStage;
  visualizationType: string;
  renderingStrategyPerAxis: ScalingStrategy[];
  isActive: boolean;
  getVisualizationData(data: Uint8Array): void;
}
