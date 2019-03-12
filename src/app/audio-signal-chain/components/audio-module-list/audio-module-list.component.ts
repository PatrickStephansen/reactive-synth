import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioModule } from '../../model/audio-module';
import { ConnectModulesEvent } from '../../model/connect-modules-event';

@Component({
  selector: 'app-audio-module-list',
  templateUrl: './audio-module-list.component.html',
  styleUrls: ['./audio-module-list.component.scss']
})
export class AudioModuleListComponent implements OnInit {
  @Input() modules: AudioModule[];
  @Input() sourceModules: AudioModule[];
  @Input() audioOutputEnabled: boolean;

  @Output() connectModules = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectModules = new EventEmitter<ConnectModulesEvent>();
  @Output() createOscillator = new EventEmitter<void>();
  @Output() createNoiseGenerator = new EventEmitter<void>();
  @Output() createGainModule = new EventEmitter<void>();
  @Output() createBitCrusherFixedPointModule = new EventEmitter<void>();
  @Output() createDelayModule = new EventEmitter<void>();
  @Output() createFilterModule = new EventEmitter<void>();
  @Output() createDistortionModule = new EventEmitter<void>();
  @Output() createRectifierModule = new EventEmitter<void>();
  @Output() createConstantSource = new EventEmitter<void>();
  @Output() toggleAudioOutputEnabled = new EventEmitter<boolean>();
  @Output() deleteModule = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  filterSourceModules({ id, sourceIds }: AudioModule) {
    const excludeIds = [id, ...sourceIds];
    return this.sourceModules
      .filter(n => !excludeIds.includes(n.id) && n.numberOutputs)
      .map(n => n.id);
  }

  getModuleId(index: number, module: AudioModule) {
    return (module && module.id) || null;
  }
}
