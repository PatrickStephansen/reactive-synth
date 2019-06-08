import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { AudioModule } from '../../model/audio-module';
import { Observable } from 'rxjs';
import {
  getModulesState,
  getSignalChainOutputActiveState,
  getOutputsState
} from '../../state/audio-signal-chain.selectors';
import {
  ResetSignalChain,
  ConnectModules,
  ToggleSignalChainActive,
  DisconnectModules,
  DestroyModule,
  CreateModule
} from '../../state/audio-signal-chain.actions';
import { ConnectModulesEvent } from '../../model/connect-modules-event';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-audio-signal-chain-shell',
  templateUrl: './audio-signal-chain-shell.component.html',
  styleUrls: ['./audio-signal-chain-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioSignalChainShellComponent implements OnInit {
  audioModules$: Observable<AudioModule[]>;
  sources$: Observable<AudioModuleOutput[]>;
  outputEnabled$: Observable<boolean>;

  constructor(private store: Store<AudioSignalChainState>) {
    this.audioModules$ = store.pipe(select(getModulesState));
    this.sources$ = store.pipe(select(getOutputsState));
    this.outputEnabled$ = store.pipe(select(getSignalChainOutputActiveState));
  }

  ngOnInit() {}

  addModule(event) {
    this.store.dispatch(new CreateModule(event));
  }

  connectModules(event: ConnectModulesEvent) {
    this.store.dispatch(new ConnectModules(event));
  }

  disconnectModules(event: ConnectModulesEvent) {
    this.store.dispatch(new DisconnectModules(event));
  }

  toggleOutputEnabled(enabled: boolean) {
    this.store.dispatch(new ToggleSignalChainActive(enabled));
  }

  deleteModule(moduleId: string) {
    this.store.dispatch(new DestroyModule(moduleId));
  }

  resetSignalChain() {
    this.store.dispatch(new ResetSignalChain());
  }
}
