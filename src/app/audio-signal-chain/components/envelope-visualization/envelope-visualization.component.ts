import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { animationFrameScheduler, filter, interval, Observable } from 'rxjs';
import { ChangeVisualizationActiveEvent } from '../../model/visualization/change-visualization-active-event';
import { Visualization } from '../../model/visualization/visualization';

@Component({
  selector: 'app-envelope-visualization',
  templateUrl: './envelope-visualization.component.html',
  styleUrls: ['./envelope-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvelopeVisualizationComponent implements OnInit, OnChanges {
  @Input()
  visualization: Visualization;

  @Output() toggleActive = new EventEmitter<ChangeVisualizationActiveEvent>();
  visualizationData = {
    stage: 0,
    stageProgress: 0,
    outputValue: 0,
    attackValue: 0,
    attackTime: 0,
    holdTime: 0,
    decayTime: 0,
    sustainValue: 0,
    releaseTime: 0
  };
  hideCanvas: boolean;
  visualizationData$: Observable<Object>;
  constructor() {}
  ngOnInit(): void {
    this.visualizationData$ = this.visualization.createVisualizationPipeline(
      interval(0, animationFrameScheduler).pipe(filter(() => !this.hideCanvas))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.hideCanvas = !changes.visualization.currentValue.isActive;
  }
  toggleVisualizationActive() {
    this.toggleActive.emit({
      name: this.visualization.name,
      moduleId: this.visualization.moduleId,
      show: !this.visualization.isActive
    });
  }
  toggleVisualizationHidden() {
    if (!this.visualization.isActive && !this.hideCanvas) {
      this.hideCanvas = true;
    } else {
      this.hideCanvas = !this.hideCanvas;
      this.toggleVisualizationActive();
    }
  }
  getEnvelopeTime({stage, parameters, stageProgress}) {
    switch (stage) {
      case 'attack':
        return parameters.attackTime * stageProgress;
      case 'hold':
        return parameters.attackTime + parameters.holdTime * stageProgress;
      case 'decay':
        return (
          parameters.attackTime +
          parameters.holdTime +
          parameters.decayTime * stageProgress
        );
      case 'sustain':
        return (
          parameters.attackTime +
          parameters.holdTime +
          parameters.decayTime +
          stageProgress
        );
      case 'release':
        return (
          parameters.attackTime +
          parameters.holdTime +
          parameters.decayTime +
          1 +
          parameters.releaseTime * stageProgress
        );
      default:
        return -1;
    }
  }
}
