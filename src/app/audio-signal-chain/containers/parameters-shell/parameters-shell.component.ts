import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import {
  getParametersForModuleState,
  getChoiceParametersForModuleState,
  getSources
} from '../../state/audio-signal-chain.selectors';
import { Parameter } from '../../model/parameter';
import { audioSignalActions } from '../../state/audio-signal-chain.actions';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-parameters-shell',
  templateUrl: './parameters-shell.component.html',
  styleUrls: ['./parameters-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParametersShellComponent implements OnInit {
  // changes in ID are not catered for
  @Input() moduleId: string;

  parameters$: Observable<Parameter[]>;
  choiceParameters$: Observable<ChoiceParameter[]>;
  sources$: Observable<AudioModuleOutput[]>;

  constructor(private store: Store<AudioSignalChainState>) {}

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getParametersForModuleState, { moduleId: this.moduleId })
    );

    this.choiceParameters$ = this.store.pipe(
      select(getChoiceParametersForModuleState, { moduleId: this.moduleId })
    );

    this.sources$ = this.store.pipe(select(getSources, { moduleId: this.moduleId }));
  }

  onParameterChanged(parameter: ChangeParameterEvent) {
    this.store.dispatch(audioSignalActions.changeParameter({ parameter }));
  }

  onChoiceParameterChanged(choice: ChangeChoiceEvent) {
    this.store.dispatch(audioSignalActions.changeChoiceParameter({ choice }));
  }

  onParameterConnected(connection: ConnectParameterEvent) {
    this.store.dispatch(audioSignalActions.connectParameter({ connection }));
  }

  onParameterDisconnected(connection: ConnectParameterEvent) {
    this.store.dispatch(audioSignalActions.disconnectParameter({ connection }));
  }
}
