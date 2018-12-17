import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Visualization } from '../../model/visualization/visualization';
import { ChangeVisualizationActiveEvent } from '../../model/visualization/change-visualization-active-event';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.scss']
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizations: Visualization[];

  @Output() toggleActive = new EventEmitter<ChangeVisualizationActiveEvent>();

  constructor() {}

  ngOnInit() {}

  getVisualizationIdentity(index: number, visualization: Visualization) {
    return `${visualization.nodeId}-${visualization.name}`;
  }
}
