import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { getInputsForModuleState, getSources } from '../../state/audio-signal-chain.selectors';
import { audioSignalActions } from '../../state/audio-signal-chain.actions';
import { ConnectModulesEvent } from '../../model/connect-modules-event';
import { AudioModuleInput } from '../../model/audio-module-input';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-inputs-shell',
  templateUrl: './inputs-shell.component.html',
  styleUrls: ['./inputs-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputsShellComponent implements OnInit {
  // changes in ID are not catered for
  @Input() moduleId: string;

  inputs$: Observable<AudioModuleInput[]>;
  sources$: Observable<AudioModuleOutput[]>;

  constructor(private store: Store<AudioSignalChainState>) {}

  ngOnInit() {
    this.inputs$ = this.store.pipe(select(getInputsForModuleState, { moduleId: this.moduleId }));
    this.sources$ = this.store.pipe(select(getSources, { moduleId: this.moduleId }));
  }

  onInputConnected(connection: ConnectModulesEvent) {
    this.store.dispatch(audioSignalActions.connectModules({ connection }));
  }

  onInputDisconnected(connection: ConnectModulesEvent) {
    this.store.dispatch(audioSignalActions.disconnectModules({ connection }));
  }
}
