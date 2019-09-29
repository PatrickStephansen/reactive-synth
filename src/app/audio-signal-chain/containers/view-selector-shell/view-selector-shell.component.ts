import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewMode } from '../../model/view-mode';
import { Store, select } from '@ngrx/store';
import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { getViewMode } from '../../state/audio-signal-chain.selectors';
import { map } from 'rxjs/operators';
import { audioSignalActions } from '../../state/audio-signal-chain.actions';

@Component({
  selector: 'app-view-selector-shell',
  templateUrl: './view-selector-shell.component.html',
  styleUrls: ['./view-selector-shell.component.scss']
})
export class ViewSelectorShellComponent implements OnInit {
  isControlsViewMode$: Observable<boolean>;
  isModulesViewMode$: Observable<boolean>;

  constructor(private store: Store<AudioSignalChainState>) {
    this.isControlsViewMode$ = store.pipe(
      select(getViewMode),
      map(vm => vm === ViewMode.Controls)
    );
    this.isModulesViewMode$ = store.pipe(
      select(getViewMode),
      map(vm => vm === ViewMode.Modules)
    );
  }

  ngOnInit() {}

  selectControlsViewMode() {
    this.store.dispatch(audioSignalActions.setViewMode({ viewMode: ViewMode.Controls }));
  }
  selectModulesViewMode() {
    this.store.dispatch(audioSignalActions.setViewMode({ viewMode: ViewMode.Modules }));
  }
}
