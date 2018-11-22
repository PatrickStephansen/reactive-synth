import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() parameter: Parameter;

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();

  parameterForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.parameterForm = this.fb.group({
      value: [this.parameter.value + '', Validators.required]
    });

    this.parameterForm.valueChanges
      // this sucks - find out why it double-triggers
      .pipe(
        distinctUntilChanged(
          (oldForm, newForm) => oldForm.value === newForm.value
        )
      )
      .subscribe(({ value }) => {
        if (this.parameterForm.valid && this.parameterForm.dirty) {
          this.updateParameterValue.emit({
            nodeId: this.parameter.nodeId,
            parameterName: this.parameter.name,
            value
          });
        }
      });
  }
}
