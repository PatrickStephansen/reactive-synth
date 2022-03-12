import { EventEmitter } from '@angular/core';
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
  // start using the next two props instead of getVisualizationData()
  visualizationData$?: Observable<any>;
  nextFrameEventEmitter?: EventEmitter<void | number>;
  getVisualizationData(data: any): void;
}
