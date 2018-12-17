import { Component, OnInit, Input } from '@angular/core';
import { Visualization } from '../../model/visualization/visualization';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.scss']
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizations: Visualization[];

  constructor() {}

  ngOnInit() {  }

  getVisualizationName(index: number, visualization: Visualization) {
    return visualization.name;
  }
}
