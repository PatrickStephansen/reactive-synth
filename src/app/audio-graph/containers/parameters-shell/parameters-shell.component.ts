import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AudioGraphState } from '../../state/audio-graph.state';
import { getParametersForNodeState } from '../../state/audio-graph.selectors';
import { Parameter } from '../../parameter';
import { ChangeParameter } from '../../state/audio-graph.actions';
import { ChangeParameterEvent } from '../../change-parameter-event';

@Component({
  selector: 'app-parameters-shell',
  templateUrl: './parameters-shell.component.html',
  styleUrls: ['./parameters-shell.component.scss']
})
export class ParametersShellComponent implements OnInit {
  // changes in ID are not catered for
  @Input() nodeId: string;

  parameters$: Observable<Parameter[]>;

  constructor(private store: Store<AudioGraphState>) {}

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getParametersForNodeState, { nodeId: this.nodeId })
    );
  }

  onParameterChanged(event: ChangeParameterEvent) {
    this.store.dispatch(new ChangeParameter(event));
  }
}
