import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  @Input() parameters: Parameter[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();

  constructor() {}

  ngOnInit() {}

  getParameterId(index, parameter: Parameter) {
    return (parameter && `${parameter.nodeId}-${parameter.name}`) || null;
  }
}
