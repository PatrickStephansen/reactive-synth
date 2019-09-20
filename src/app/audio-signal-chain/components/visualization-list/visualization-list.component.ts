import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Visualization } from '../../model/visualization/visualization';
import { ChangeVisualizationActiveEvent } from '../../model/visualization/change-visualization-active-event';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizations: Visualization[];

  @Output() toggleActive = new EventEmitter<ChangeVisualizationActiveEvent>();

  constructor() {}

  ngOnInit() {}

  getVisualizationIdentity(index: number, visualization: Visualization) {
    return `${visualization.moduleId}-${visualization.name}`;
  }
}
