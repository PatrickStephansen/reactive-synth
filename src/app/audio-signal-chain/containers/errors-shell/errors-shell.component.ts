import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { Observable } from 'rxjs';
import { SignalChainError } from '../../model/signal-chain-error';
import { getSignalChainErrors } from '../../state/audio-signal-chain.selectors';
import { ClearErrors, DismissError } from '../../state/audio-signal-chain.actions';

@Component({
  selector: 'app-errors-shell',
  templateUrl: './errors-shell.component.html',
  styleUrls: ['./errors-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsShellComponent implements OnInit {
  public errors$: Observable<SignalChainError[]>;

  constructor(private store: Store<AudioSignalChainState>) {
    this.errors$ = store.pipe(select(getSignalChainErrors));
  }

  ngOnInit() {}

  clearErrors() {
    this.store.dispatch(new ClearErrors());
  }

  dismissError(errorId: string) {
    this.store.dispatch(new DismissError(errorId));
  }
}
