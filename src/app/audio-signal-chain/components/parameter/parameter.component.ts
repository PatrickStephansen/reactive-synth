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

import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { distinctUntilChanged } from 'rxjs/operators';
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
    const selectedSourceNoLongerAvailable =
      changes.availableSourceModules &&
      !changes.availableSourceModules.isFirstChange() &&
      this.parameterForm.value.selectedSourceModule &&
      !this.availableSourceModules.includes(
        this.parameterForm.value.selectedSourceModule
      );

    if (selectedSourceNoLongerAvailable) {
      this.parameterForm.patchValue({ selectedSourceModule: '' });
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
    }
  }

  disconnectParameterFromSource(sourceModuleId) {
    this.disconnectSourceModule.emit({
      sourceModuleId,
      destinationModuleId: this.parameter.moduleId,
      destinationParameterName: this.parameter.name
    });
  }

  get parameterValue() { return this.parameterForm.get('parameterValue'); }
}
