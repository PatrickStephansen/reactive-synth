import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AudioNode } from '../../model/audio-node';
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
  @Input() sourceNodeIds: string[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() updateChoiceParameterValue = new EventEmitter<ChangeChoiceEvent>();
  @Output() connectParameter = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectParameter = new EventEmitter<ConnectParameterEvent>();

  constructor() {}

  ngOnInit() {}

  getParameterId(index, parameter: Parameter) {
    return (parameter && `${parameter.nodeId}-${parameter.name}`) || null;
  }

  filterSourceNodes({ sourceIds }: Parameter) {
    return this.sourceNodeIds.filter(n => !sourceIds.includes(n));
  }
}
