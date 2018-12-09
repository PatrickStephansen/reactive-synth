import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

import { AppState } from 'src/app/state/app.state';
import { showHelpSelector } from 'src/app/state/app.selectors';
import { ToggleHelp } from 'src/app/state/app.actions';

@Component({
  selector: 'app-help-message',
  templateUrl: './help-message.component.html',
  styleUrls: ['./help-message.component.scss']
})
export class HelpMessageComponent implements OnInit, OnDestroy {
  public isShowingHelp: boolean;
  private isComponentActive = true;

  constructor(private store: Store<AppState>) {
    this.store
      .pipe(
        select(showHelpSelector),
        takeWhile(() => this.isComponentActive)
      )
      .subscribe(isShowingHelp => (this.isShowingHelp = isShowingHelp));
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.isComponentActive = false;
  }

  hideHelp() {
    this.store.dispatch(new ToggleHelp(false));
  }
}
