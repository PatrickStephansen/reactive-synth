import { Component, OnInit, Input } from '@angular/core';
import { Visualization } from '../../model/visualization';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.scss']
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizations: Visualization[];

  constructor() {}

  ngOnInit() {
    console.log(`${this.visualizations.length} visualz`);
  }

  getVisualizationName(index: number, visualization: Visualization) {
    return visualization.name;
  }
}