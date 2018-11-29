import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  @Input() parameters: Parameter[];
  @Input() choiceParameters: ChoiceParameter[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() updateChoiceParameterValue = new EventEmitter<ChangeChoiceEvent>();

  constructor() {}

  ngOnInit() {}

  getParameterId(index, parameter: Parameter) {
    return (parameter && `${parameter.nodeId}-${parameter.name}`) || null;
  }
}
