import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Visualization } from '../../model/visualization';

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
    const pixelsPerSample = canvasWidth / this.visualization.dataLength;
    const pixelsPerAmplitude = canvasHeight / 255;
    this.drawingContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.drawingContext.beginPath();

    this.visualizationData.forEach((amplitude, index) => {
      if (index) {
        this.drawingContext.lineTo(
          pixelsPerSample * index,
          canvasHeight - amplitude * pixelsPerAmplitude
        );
      } else {
        this.drawingContext.moveTo(
          pixelsPerSample * index,
          canvasHeight - amplitude * pixelsPerAmplitude
        );
      }
    });

    this.drawingContext.stroke();

    requestAnimationFrame(() => this.renderVisuals());
  }
}
