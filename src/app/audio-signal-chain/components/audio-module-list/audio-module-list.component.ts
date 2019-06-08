import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioModule } from '../../model/audio-module';
import { ConnectModulesEvent } from '../../model/connect-modules-event';
import { CreateModuleEvent } from '../../model/create-module-event';
import { thisExpression } from '@babel/types';
import { AudioModuleType } from '../../model/audio-module-type';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-audio-module-list',
  templateUrl: './audio-module-list.component.html',
  styleUrls: ['./audio-module-list.component.scss']
})
export class AudioModuleListComponent implements OnInit {
  @Input() modules: AudioModule[];
  @Input() sources: AudioModuleOutput[];
  @Input() audioOutputEnabled: boolean;

  @Output() connectModules = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectModules = new EventEmitter<ConnectModulesEvent>();
  @Output() createModule = new EventEmitter<CreateModuleEvent>();
  @Output() toggleAudioOutputEnabled = new EventEmitter<boolean>();
  @Output() deleteModule = new EventEmitter<string>();
  @Output() resetSignalChain = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  getModuleId(index: number, module: AudioModule) {
    return (module && module.id) || null;
  }

  createOscillator() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Oscillator));
  }
  createNoiseGenerator() {
    this.createModule.emit(
      new CreateModuleEvent(AudioModuleType.NoiseGenerator)
    );
  }
  createConstantSource() {
    this.createModule.emit(
      new CreateModuleEvent(AudioModuleType.ConstantSource)
    );
  }
  createGainModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Gain));
  }
  createInverseGainModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.InverseGain));
  }
  createBitCrusher() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.BitCrusher));
  }
  createDelayModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Delay));
  }
  createFilterModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Filter));
  }
  createDistortionModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Distortion));
  }
  createRectifierModule() {
    this.createModule.emit(new CreateModuleEvent(AudioModuleType.Rectifier));
  }
}
