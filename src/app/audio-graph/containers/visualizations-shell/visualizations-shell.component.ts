import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AudioGraphState } from '../../state/audio-graph.state';
import { Observable } from 'rxjs';
import { Visualization } from '../../model/visualization/visualization';
import { getVisualizationsForNodeState } from '../../state/audio-graph.selectors';

@Component({
  selector: 'app-visualizations-shell',
  templateUrl: './visualizations-shell.component.html',
  styleUrls: ['./visualizations-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationsShellComponent implements OnInit {
  @Input() nodeId: string;

  visualizations$: Observable<Visualization[]>;

  constructor(private store: Store<AudioGraphState>) {}

  ngOnInit() {
    this.visualizations$ = this.store.pipe(
      select(getVisualizationsForNodeState, { nodeId: this.nodeId })
    );
  }
}
