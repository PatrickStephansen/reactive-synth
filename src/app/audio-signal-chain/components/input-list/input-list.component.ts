import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AudioModuleOutput } from '../../model/audio-module-output';
import { AudioModuleInput } from '../../model/audio-module-input';
import { ConnectModulesEvent } from '../../model/connect-modules-event';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputListComponent implements OnInit {
  @Input() sources: AudioModuleOutput[];
  @Input() inputs: AudioModuleInput[];

  @Output() connectInput = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectInput = new EventEmitter<ConnectModulesEvent>();

  constructor() {}

  ngOnInit() {}

  getInputId(_, input: AudioModuleInput) {
    return (input && `${input.moduleId}-${input.name}`) || null;
  }

  filterSources({ sources }: AudioModuleInput) {
    if (!this.sources) {
      return [];
    }
    return this.sources.filter(
      source =>
        !sources.some(
          s => s.moduleId === source.moduleId && s.name === source.name
        )
    );
  }
}
