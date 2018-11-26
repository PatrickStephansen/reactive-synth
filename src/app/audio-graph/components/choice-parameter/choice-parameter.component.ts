import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ChoiceParameter } from '../../model/choice-parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';

@Component({
  selector: 'app-choice-parameter',
  templateUrl: './choice-parameter.component.html',
  styleUrls: ['./choice-parameter.component.scss']
})
export class ChoiceParameterComponent implements OnInit {
  @Input() parameter: ChoiceParameter;
  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();

  constructor() {}

  ngOnInit() {}

  changeSelection(selection) {
    this.updateParameterValue.emit({
      nodeId: this.parameter.nodeId,
      parameterName: this.parameter.name,
      value: selection
    });
  }
}
