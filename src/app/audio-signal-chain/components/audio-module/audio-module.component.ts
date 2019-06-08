import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectModulesEvent } from '../../model/connect-modules-event';
import { AudioModule } from '../../model/audio-module';

@Component({
  selector: 'app-audio-module',
  templateUrl: './audio-module.component.html',
  styleUrls: ['./audio-module.component.scss']
})
export class AudioModuleComponent implements OnInit, OnChanges {
  @Input() module: AudioModule;
  @Input() availableSourceModules: string[];
  @Output() connectSourceModule = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectSourceModule = new EventEmitter<ConnectModulesEvent>();
  @Output() deleteModule = new EventEmitter<string>();

  connectModuleForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.connectModuleForm = this.formBuilder.group({
      selectedSourceModule: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedSourceNoLongerAvailable =
      changes.availableSourceModules &&
      !changes.availableSourceModules.isFirstChange() &&
      this.connectModuleForm.value.selectedSourceModule &&
      !this.availableSourceModules.includes(
        this.connectModuleForm.value.selectedSourceModule
      );

    if (selectedSourceNoLongerAvailable) {
      this.connectModuleForm.patchValue({ selectedSourceModule: '' });
    }
  }
}
