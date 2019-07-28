import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { distinctUntilChanged, sampleTime } from 'rxjs/operators';

import { Parameter } from '../../model/parameter';
import { ChangeParameterEvent } from '../../model/change-parameter-event';
import { ConnectParameterEvent } from '../../model/connect-parameter-event';
import { AudioModuleOutput } from '../../model/audio-module-output';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() parameter: Parameter;
  @Input() availableSources: AudioModuleOutput[];

  @Output() updateParameterValue = new EventEmitter<ChangeParameterEvent>();
  @Output() connectSource = new EventEmitter<ConnectParameterEvent>();
  @Output() disconnectSource = new EventEmitter<ConnectParameterEvent>();

  addInputsId: string;
  isSourceListOpen = false;
  parameterChanged = new EventEmitter<number>();
  @ViewChild('parameterValue', { static: true })
  parameterFormValue;

  constructor() {}

  ngOnInit() {
    this.addInputsId = `add-input-${this.parameter.moduleId}-${this.parameter.name}`;

    this.parameterChanged
      .pipe(
        distinctUntilChanged(),
        sampleTime(100)
      )
      .subscribe(parameterValue => {
        if (this.parameterFormValue.valid) {
          this.updateParameterValue.emit({
            moduleId: this.parameter.moduleId,
            parameterName: this.parameter.name,
            value: parameterValue
          });
        }
      });
  }

  disconnectFromSource(source) {
    this.disconnectSource.emit({
      sourceModuleId: source.moduleId,
      sourceOutputName: source.name,
      destinationModuleId: this.parameter.moduleId,
      destinationParameterName: this.parameter.name
    });
  }

  toggleSourceList() {
    this.isSourceListOpen = !this.isSourceListOpen;
  }

  closeSourceList() {
    this.isSourceListOpen = false;
  }

  connectToSource(source: AudioModuleOutput) {
    if (source.name && source.moduleId) {
      this.connectSource.emit({
        sourceModuleId: source.moduleId,
        sourceOutputName: source.name,
        destinationModuleId: this.parameter.moduleId,
        destinationParameterName: this.parameter.name
      });
      this.toggleSourceList();
    }
  }
}
