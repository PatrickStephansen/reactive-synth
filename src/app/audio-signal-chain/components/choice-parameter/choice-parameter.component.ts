import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeChoiceEvent } from '../../model/change-choice-event';

@Component({
  selector: 'app-choice-parameter',
  templateUrl: './choice-parameter.component.html',
  styleUrls: ['./choice-parameter.component.scss']
})
export class ChoiceParameterComponent implements OnInit {
  @Input() parameter: ChoiceParameter;
  @Output() updateParameterValue = new EventEmitter<ChangeChoiceEvent>();

  constructor() {}

  ngOnInit() {}

  changeSelection(selection) {
    this.updateParameterValue.emit({
      moduleId: this.parameter.moduleId,
      parameterName: this.parameter.name,
      value: selection
    });
  }
}
