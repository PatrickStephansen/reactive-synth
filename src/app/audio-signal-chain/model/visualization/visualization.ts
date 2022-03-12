import { Observable } from 'rxjs';
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
  // move towards this - it makes more sense
  createVisualizationPipeline(getNext: Observable<any>): Observable<any>;
  getVisualizationData(data: any): void;
}
