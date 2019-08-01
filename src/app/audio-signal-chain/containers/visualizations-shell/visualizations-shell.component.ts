import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { Observable } from 'rxjs';
import { Visualization } from '../../model/visualization/visualization';
import { getVisualizationsForModuleState } from '../../state/audio-signal-chain.selectors';
import { audioSignalActions } from '../../state/audio-signal-chain.actions';
import { ChangeVisualizationActiveEvent } from '../../model/visualization/change-visualization-active-event';

@Component({
  selector: 'app-visualizations-shell',
  templateUrl: './visualizations-shell.component.html',
  styleUrls: ['./visualizations-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationsShellComponent implements OnInit {
  @Input() moduleId: string;

  visualizations$: Observable<Visualization[]>;

  constructor(private store: Store<AudioSignalChainState>) {}

  ngOnInit() {
    this.visualizations$ = this.store.pipe(
      select(getVisualizationsForModuleState, { moduleId: this.moduleId })
    );
  }

  toggleActive(change: ChangeVisualizationActiveEvent) {
    this.store.dispatch(audioSignalActions.toggleVisualizationActive({ change }));
  }
}
