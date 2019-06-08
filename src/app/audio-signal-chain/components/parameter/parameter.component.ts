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
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit, OnChanges {
  @Input() parameter: Parameter;
  @Input() availableSources: AudioModuleOutput[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() connectSource = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectSource = new EventEmitter<ConnectParameterEvent>();

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
      selectedSource: ['', Validators.required]
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

      this.connectSource.emit({
        sourceModuleId: formValue.selectedSource.split('~')[0],
        sourceOutputName: formValue.selectedSource.split('~')[1],
        destinationModuleId: this.parameter.moduleId,
        destinationParameterName: this.parameter.name
      });
      this.parameterForm.patchValue({ selectedSource: '' });
    }
  }

  disconnectParameterFromSource(source) {
    this.disconnectSource.emit({
      sourceModuleId: source.moduleId,
      sourceOutputName: source.name,
      destinationModuleId: this.parameter.moduleId,
      destinationParameterName: this.parameter.name
    });
  }

  get parameterValue() {
    return this.parameterForm.get('parameterValue');
  }
}
