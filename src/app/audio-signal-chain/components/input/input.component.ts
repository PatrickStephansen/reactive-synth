import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { AudioModuleInput } from '../../model/audio-module-input';
import { AudioModuleOutput } from '../../model/audio-module-output';
import { ConnectModulesEvent } from '../../model/connect-modules-event';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit {
  @Input() input: AudioModuleInput;
  @Input() availableSources: AudioModuleOutput[];

  @Output() connectInput = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectInput = new EventEmitter<ConnectModulesEvent>();

  constructor() {}

  ngOnInit() {}

  onSourceConnected(event) {
    const selected = event.target.value;
    const [moduleId, name] = selected.split('~');
    this.connectInput.emit({
      sourceId: moduleId,
      sourceOutputName: name,
      destinationId: this.input.moduleId,
      destinationInputName: this.input.name
    });
    event.target.value = '';
  }

  onSourceDisconnected({ moduleId, name }) {
    this.disconnectInput.emit({
      sourceId: moduleId,
      sourceOutputName: name,
      destinationId: this.input.moduleId,
      destinationInputName: this.input.name
    });
  }
}
