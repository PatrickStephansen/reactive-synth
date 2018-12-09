import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { showHelpSelector } from 'src/app/state/app.selectors';
import { ToggleHelp } from 'src/app/state/app.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-toggle-help',
  templateUrl: './toggle-help.component.html',
  styleUrls: ['./toggle-help.component.scss']
})
export class ToggleHelpComponent implements OnInit, OnDestroy {
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

  toggleHelp() {
    this.store.dispatch(new ToggleHelp(!this.isShowingHelp));
  }
}
