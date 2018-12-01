import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AudioGraphState } from '../../state/audio-graph.state';
import {
  getParametersForNodeState,
  getChoiceParametersForNodeState,
  getSourceNodeIds
} from '../../state/audio-graph.selectors';
import { AudioNode } from '../../model/audio-node';
import { Parameter } from '../../model/parameter';
import {
  ChangeParameter,
  ChangeChoiceParameter,
  ConnectParameter,
  DisconnectParameter
} from '../../state/audio-graph.actions';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';

@Component({
  selector: 'app-parameters-shell',
  templateUrl: './parameters-shell.component.html',
  styleUrls: ['./parameters-shell.component.scss']
})
export class ParametersShellComponent implements OnInit {
  // changes in ID are not catered for
  @Input() nodeId: string;

  parameters$: Observable<Parameter[]>;
  choiceParameters$: Observable<ChoiceParameter[]>;
  sourceNodeIds$: Observable<string[]>;

  constructor(private store: Store<AudioGraphState>) {}

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getParametersForNodeState, { nodeId: this.nodeId })
    );

    this.choiceParameters$ = this.store.pipe(
      select(getChoiceParametersForNodeState, { nodeId: this.nodeId })
    );

    this.sourceNodeIds$ = this.store.pipe(
      select(getSourceNodeIds, { nodeId: this.nodeId })
    );
  }

  onParameterChanged(event: ChangeParameterEvent) {
    this.store.dispatch(new ChangeParameter(event));
  }

  onChoiceParameterChanged(event: ChangeChoiceEvent) {
    this.store.dispatch(new ChangeChoiceParameter(event));
  }

  onParameterConnected(event: ConnectParameterEvent) {
    this.store.dispatch(new ConnectParameter(event));
  }

  onParameterDisconnected(event: ConnectParameterEvent) {
    this.store.dispatch(new DisconnectParameter(event));
  }
}
