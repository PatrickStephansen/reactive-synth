import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ControlSurface } from '../../model/control-surface';
import { getActiveControlSurface } from '../../state/audio-signal-chain.selectors';
import { audioSignalActions } from '../../state/audio-signal-chain.actions';
import { ViewMode } from '../../model/view-mode';
import { ControlSurfaceRangeChangeEvent } from '../../model/control-surface-range-change-event';
import { ControlSurfaceValueChangeEvent } from '../../model/control-surface-value-change-event';

@Component({
  selector: 'app-controls-shell',
  templateUrl: './controls-shell.component.html',
  styleUrls: ['./controls-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsShellComponent implements OnInit {
  ActiveControlSurface$: Observable<ControlSurface>;

  constructor(private store: Store<AudioSignalChainState>) {
    this.ActiveControlSurface$ = store.pipe(select(getActiveControlSurface));
  }

  ngOnInit() {}

  goToModulesView() {
    this.store.dispatch(audioSignalActions.setViewMode({ viewMode: ViewMode.Modules }));
  }

  updateCoordinates(event: ControlSurfaceValueChangeEvent) {
    this.store.dispatch(audioSignalActions.updateControlSurfaceCoordinates({ change: event }));
  }

  updateRange(event: ControlSurfaceRangeChangeEvent) {
    this.store.dispatch(audioSignalActions.updateControlSurfaceRange({ change: event }));
  }
}
