import { Component, OnInit, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AudioSignalChainState } from '../../state/audio-signal-chain.state';
import { AudioModule } from '../../model/audio-module';
import { Observable } from 'rxjs';
import {
  getModulesState,
  getSignalChainOutputActiveState
} from '../../state/audio-signal-chain.selectors';
import {
  ResetSignalChain,
  CreateOscillator,
  ConnectModules,
  ToggleSignalChainActive,
  DisconnectModules,
  CreateGainModule,
  DestroyModule,
  CreateDelayModule,
  CreateDistortionModule,
  CreateConstantSource,
  CreateFilterModule,
  CreateRectifierModule
} from '../../state/audio-signal-chain.actions';
import { ConnectModulesEvent } from '../../model/connect-modules-event';

@Component({
  selector: 'app-audio-signal-chain-shell',
  templateUrl: './audio-signal-chain-shell.component.html',
  styleUrls: ['./audio-signal-chain-shell.component.scss']
})
export class AudioSignalChainShellComponent implements OnInit {
  audioModules$: Observable<AudioModule[]>;
  outputEnabled$: Observable<boolean>;

  constructor(private store: Store<AudioSignalChainState>) {
    store.dispatch(new ResetSignalChain());
    this.audioModules$ = store.pipe(select(getModulesState));
    this.outputEnabled$ = store.pipe(select(getSignalChainOutputActiveState));
  }

  ngOnInit() {}

  addOscillator() {
    this.store.dispatch(new CreateOscillator());
  }

  addGainModule() {
    this.store.dispatch(new CreateGainModule());
  }

  addDelayModule() {
    this.store.dispatch(new CreateDelayModule());
  }

  addFilterModule() {
    this.store.dispatch(new CreateFilterModule());
  }

  addDistortionModule() {
    this.store.dispatch(new CreateDistortionModule());
  }

  addRectifierModule() {
    this.store.dispatch(new CreateRectifierModule());
  }

  addConstantSource() {
    this.store.dispatch(new CreateConstantSource());
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
}
