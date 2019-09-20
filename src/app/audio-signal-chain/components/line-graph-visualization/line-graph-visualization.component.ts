import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { curry, flip } from 'ramda';

import { Visualization } from '../../model/visualization/visualization';
import { ChangeVisualizationActiveEvent } from '../../model/visualization/change-visualization-active-event';

@Component({
  selector: 'app-line-graph-visualization',
  templateUrl: './line-graph-visualization.component.html',
  styleUrls: ['./line-graph-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineGraphVisualizationComponent implements OnInit, OnChanges {
  @Input()
  visualization: Visualization;

  @Output() toggleActive = new EventEmitter<ChangeVisualizationActiveEvent>();

  private visualizationData: Uint8Array;
  @ViewChild('lineGraphCanvas', { static: true })
  private canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private drawingContext: CanvasRenderingContext2D;
  hideCanvas: boolean;

  constructor() {}

  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.drawingContext = this.canvas.getContext('2d');
    this.drawingContext.strokeStyle = 'green';
    this.visualizationData = new Uint8Array(this.visualization.dataLength);
    if (this.visualization.isActive) {
      requestAnimationFrame(() => this.renderVisuals());
      this.hideCanvas = false;
    } else {
      this.hideCanvas = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes.visualization.isFirstChange() &&
      !changes.visualization.previousValue.isActive &&
      changes.visualization.currentValue.isActive
    ) {
      this.hideCanvas = false;
      this.renderVisuals();
    }
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

  private renderVisuals() {
    this.visualization.getVisualizationData(this.visualizationData);
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    const getPixelX = curry(
      flip(this.visualization.renderingStrategyPerAxis[0])
    )(this.visualization.dataLength, canvasWidth);
    const getPixelY = curry(
      flip(this.visualization.renderingStrategyPerAxis[1])
    )(255, canvasHeight);
    this.drawingContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.drawingContext.beginPath();
    this.visualizationData.forEach((amplitude, index) => {
      const x = getPixelX(index);
      const y = canvasHeight - getPixelY(amplitude);
      if (index) {
        this.drawingContext.lineTo(x, y);
      } else {
        this.drawingContext.moveTo(x, y);
      }
    });
    this.drawingContext.stroke();
    if (this.visualization.isActive) {
      requestAnimationFrame(() => this.renderVisuals());
    } else {
      this.drawPause(canvasWidth, canvasHeight);
    }
  }

  private drawPause(canvasWidth: number, canvasHeight: number) {
    this.drawingContext.save();
    this.drawingContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.drawingContext.fillRect(
      canvasWidth * 0.47,
      canvasHeight * 0.43,
      canvasWidth * 0.02,
      canvasHeight * 0.14
    );
    this.drawingContext.fillRect(
      canvasWidth * 0.51,
      canvasHeight * 0.43,
      canvasWidth * 0.02,
      canvasHeight * 0.14
    );
    this.drawingContext.restore();
  }
}
