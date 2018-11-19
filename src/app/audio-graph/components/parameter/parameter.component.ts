import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Parameter } from '../../parameter';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() parameter: Parameter;

  @Output() parameterValueChanged = new EventEmitter<{
    parameterName: string;
    value: number;
  }>();

  parameterForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.parameterForm = this.fb.group({
      value: ['' + this.parameter.value]
    });
  }
}
