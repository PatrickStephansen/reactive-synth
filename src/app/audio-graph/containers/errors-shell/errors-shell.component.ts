import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioGraphState } from '../../state/audio-graph.state';
import { Observable } from 'rxjs';
import { GraphError } from '../../model/graph-error';
import { getGraphErrors } from '../../state/audio-graph.selectors';
import { ClearErrors, DismissError } from '../../state/audio-graph.actions';

@Component({
  selector: 'app-errors-shell',
  templateUrl: './errors-shell.component.html',
  styleUrls: ['./errors-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsShellComponent implements OnInit {
  public errors$: Observable<GraphError[]>;

  constructor(private store: Store<AudioGraphState>) {
    this.errors$ = store.pipe(select(getGraphErrors));
  }

  ngOnInit() {}

  clearErrors() {
    this.store.dispatch(new ClearErrors());
  }

  dismissError(errorId: string) {
    this.store.dispatch(new DismissError(errorId));
  }
}
