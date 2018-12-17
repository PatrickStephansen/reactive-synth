import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { curry, flip } from 'ramda';

import { Visualization } from '../../model/visualization/visualization';

@Component({
  selector: 'app-line-graph-visualization',
  templateUrl: './line-graph-visualization.component.html',
  styleUrls: ['./line-graph-visualization.component.scss']
})
export class LineGraphVisualizationComponent implements OnInit {
  @Input() visualization: Visualization;

  private visualizationData: Uint8Array;
  @ViewChild('lineGraphCanvas')
  private canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private drawingContext: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.drawingContext = this.canvas.getContext('2d');
    this.drawingContext.strokeStyle = 'green';
    this.visualizationData = new Uint8Array(this.visualization.dataLength);
    requestAnimationFrame(() => this.renderVisuals());
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

    requestAnimationFrame(() => this.renderVisuals());
  }
}
