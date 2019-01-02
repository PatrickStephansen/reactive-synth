import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import {
  getParametersForModuleState,
  getChoiceParametersForModuleState,
  getSourceModuleIds
} from '../../state/audio-signal-chain.selectors';
import { AudioModule } from '../../model/audio-module';
import { Parameter } from '../../model/parameter';
import {
  ChangeParameter,
  ChangeChoiceParameter,
  ConnectParameter,
  DisconnectParameter
} from '../../state/audio-signal-chain.actions';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';

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
  sourceModuleIds$: Observable<string[]>;

  constructor(private store: Store<AudioSignalChainState>) {}

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getParametersForModuleState, { moduleId: this.moduleId })
    );

    this.choiceParameters$ = this.store.pipe(
      select(getChoiceParametersForModuleState, { moduleId: this.moduleId })
    );

    this.sourceModuleIds$ = this.store.pipe(
      select(getSourceModuleIds, { moduleId: this.moduleId })
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
