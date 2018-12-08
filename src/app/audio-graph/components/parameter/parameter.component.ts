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
  @Input() availableSourceNodes: string[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() connectSourceNode = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectSourceNode = new EventEmitter<ConnectParameterEvent>();

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
      selectedSourceNode: ['', Validators.required]
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
            nodeId: this.parameter.nodeId,
            parameterName: this.parameter.name,
            value: parameterValue
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedSourceNoLongerAvailable =
      changes.availableSourceNodes &&
      !changes.availableSourceNodes.isFirstChange() &&
      this.parameterForm.value.selectedSourceNode &&
      !this.availableSourceNodes.includes(
        this.parameterForm.value.selectedSourceNode
      );

    if (selectedSourceNoLongerAvailable) {
      this.parameterForm.patchValue({ selectedSourceNode: '' });
    }
  }

  connectParameterToSource() {
    if (this.parameterForm.valid) {
      const formValue = this.parameterForm.value;

      this.connectSourceNode.emit({
        sourceNodeId: formValue.selectedSourceNode,
        destinationNodeId: this.parameter.nodeId,
        destinationParameterName: this.parameter.name
      });
    }
  }

  disconnectParameterFromSource(sourceNodeId) {
    this.disconnectSourceNode.emit({
      sourceNodeId,
      destinationNodeId: this.parameter.nodeId,
      destinationParameterName: this.parameter.name
    });
  }

  get parameterValue() { return this.parameterForm.get('parameterValue'); }
}
