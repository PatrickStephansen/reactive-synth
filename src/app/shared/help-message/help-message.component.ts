import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AppState } from 'src/app/state/app.state';
import { showHelpSelector } from 'src/app/state/app.selectors';
import { appActions } from 'src/app/state/app.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-help-message',
  templateUrl: './help-message.component.html',
  styleUrls: ['./help-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpMessageComponent {
  public isShowingHelp$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isShowingHelp$ = this.store
      .pipe(
        select(showHelpSelector)
      )
  }

  hideHelp() {
    this.store.dispatch(appActions.toggleHelp({ showHelp: false }));
  }
}
