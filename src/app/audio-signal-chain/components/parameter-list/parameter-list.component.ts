import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterListComponent implements OnInit {
  @Input() parameters: Parameter[];
  @Input() choiceParameters: ChoiceParameter[];
  @Input() sources: AudioModuleOutput[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() updateChoiceParameterValue = new EventEmitter<ChangeChoiceEvent>();
  @Output() connectParameter = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectParameter = new EventEmitter<ConnectParameterEvent>();

  constructor() {}

  ngOnInit() {}

  getParameterId(index, parameter: Parameter) {
    return (parameter && `${parameter.moduleId}-${parameter.name}`) || null;
  }

  filterSources({ sources }: Parameter) {
    return this.sources.filter(
      source =>
        !sources.some(
          s => s.moduleId === source.moduleId && s.name === source.name
        )
    );
  }
}
