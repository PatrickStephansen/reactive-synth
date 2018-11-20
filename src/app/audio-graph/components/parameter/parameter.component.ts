import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Parameter } from '../../parameter';
import { ChangeParameterEvent } from '../../change-parameter-event';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() parameter: Parameter;

  @Output() parameterValueChanged = new EventEmitter<ChangeParameterEvent>();

  parameterForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.parameterForm = this.fb.group({
      value: ['' + this.parameter.value]
    });


  }
}
