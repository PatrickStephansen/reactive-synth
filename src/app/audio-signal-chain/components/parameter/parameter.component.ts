import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { path } from 'ramda';
import { distinctUntilChanged } from 'rxjs/operators';

import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit, OnChanges {
  @Input() parameter: Parameter;
  @Input() availableSourceModules: string[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() connectSourceModule = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectSourceModule = new EventEmitter<ConnectParameterEvent>();

  parameterForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.parameterForm = this.fb.group({
      parameterValue: [
        this.parameter.value + '',
        [
          Validators.required,
          Validators.max(this.parameter.maxValue),
          Validators.min(this.parameter.minValue)
        ]
      ],
      selectedSourceModule: ['', Validators.required]
    });

    this.parameterForm.valueChanges
      .pipe(
        distinctUntilChanged(
          (oldForm, newForm) =>
            oldForm.parameterValue === newForm.parameterValue
        )
      )
      .subscribe(({ parameterValue }) => {
        if (
          this.parameterForm.controls.parameterValue.valid &&
          this.parameterForm.dirty
        ) {
          this.updateParameterValue.emit({
            moduleId: this.parameter.moduleId,
            parameterName: this.parameter.name,
            value: parameterValue
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = path(['parameter', 'currentValue', 'value'], changes);
    const previousValue = path(
      ['parameter', 'previousValue', 'value'],
      changes
    );
    if (this.parameterForm && currentValue !== previousValue) {
      this.parameterForm.patchValue({
        parameterValue: changes.parameter.currentValue.value + ''
      });
    }
  }

  connectParameterToSource() {
    if (this.parameterForm.valid) {
      const formValue = this.parameterForm.value;

      this.connectSourceModule.emit({
        sourceModuleId: formValue.selectedSourceModule,
        destinationModuleId: this.parameter.moduleId,
        destinationParameterName: this.parameter.name
      });
      this.parameterForm.patchValue({ selectedSourceModule: '' });
    }
  }

  disconnectParameterFromSource(sourceModuleId) {
    this.disconnectSourceModule.emit({
      sourceModuleId,
      destinationModuleId: this.parameter.moduleId,
      destinationParameterName: this.parameter.name
    });
  }

  get parameterValue() {
    return this.parameterForm.get('parameterValue');
  }
}
