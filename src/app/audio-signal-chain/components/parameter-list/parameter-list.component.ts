import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioModule } from '../../model/audio-module';
import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  @Input() parameters: Parameter[];
  @Input() choiceParameters: ChoiceParameter[];
  @Input() sourceModuleIds: string[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() updateChoiceParameterValue = new EventEmitter<ChangeChoiceEvent>();
  @Output() connectParameter = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectParameter = new EventEmitter<ConnectParameterEvent>();

  constructor() {}

  ngOnInit() {}

  getParameterId(index, parameter: Parameter) {
    return (parameter && `${parameter.moduleId}-${parameter.name}`) || null;
  }

  filterSourceModules({ sourceIds }: Parameter) {
    return this.sourceModuleIds.filter(n => !sourceIds.includes(n));
  }
}
