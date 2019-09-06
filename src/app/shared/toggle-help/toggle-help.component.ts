import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store, select } from '@ngrx/store';
import { showHelpSelector } from 'src/app/state/app.selectors';
import { appActions } from 'src/app/state/app.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toggle-help',
  templateUrl: './toggle-help.component.html',
  styleUrls: ['./toggle-help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleHelpComponent {
  public isShowingHelp$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isShowingHelp$ = this.store
      .pipe(
        select(showHelpSelector)
      )
  }

  toggleHelp(showHelp) {
    this.store.dispatch(appActions.toggleHelp({ showHelp }));
  }
}
