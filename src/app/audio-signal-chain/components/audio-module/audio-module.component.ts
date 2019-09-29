import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectModulesEvent } from '../../model/connect-modules-event';
import { AudioModule } from '../../model/audio-module';
import { distinctUntilChanged, debounceTime, takeWhile } from 'rxjs/operators';
import { ChangeModuleNameEvent } from '../../model/change-module-name-event';
import { AudioModuleType } from '../../model/audio-module-type';
import { ActivateControlSurfaceEvent } from '../../model/activate-control-surface-event';

@Component({
  selector: 'app-audio-module',
  templateUrl: './audio-module.component.html',
  styleUrls: ['./audio-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioModuleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() module: AudioModule;
  @Input() availableSourceModules: string[];
  @Output() connectSourceModule = new EventEmitter<ConnectModulesEvent>();
  @Output() disconnectSourceModule = new EventEmitter<ConnectModulesEvent>();
  @Output() deleteModule = new EventEmitter<string>();
  @Output() changeModuleName = new EventEmitter<ChangeModuleNameEvent>();
  @Output() activateControlSurface = new EventEmitter<ActivateControlSurfaceEvent>();

  onNameChange = new EventEmitter<string>();

  isEditingName = false;
  isActive = true;
  isControlSurface: boolean;

  connectModuleForm: FormGroup;

  @ViewChild('nameInput', { static: true }) nameInputElement: ElementRef;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.connectModuleForm = this.formBuilder.group({
      selectedSourceModule: ['', Validators.required]
    });

    this.onNameChange
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeWhile(() => this.isActive)
      )
      .subscribe(name =>
        this.changeModuleName.emit({
          name: name === this.module.id ? undefined : name,
          moduleId: this.module.id
        })
      );

    this.isControlSurface = this.module.moduleType === AudioModuleType.ControlSurface;
  }

  ngOnDestroy() {
    this.isActive = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedSourceNoLongerAvailable =
      changes.availableSourceModules &&
      !changes.availableSourceModules.isFirstChange() &&
      this.connectModuleForm.value.selectedSourceModule &&
      !this.availableSourceModules.includes(this.connectModuleForm.value.selectedSourceModule);

    if (selectedSourceNoLongerAvailable) {
      this.connectModuleForm.patchValue({ selectedSourceModule: '' });
    }
  }

  editName(isBusyEditing) {
    this.isEditingName = isBusyEditing;
    if (isBusyEditing) {
      setTimeout(() => {
        this.nameInputElement.nativeElement.focus();
      });
    }
  }

  unfocusOnSubmitName(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.nameInputElement.nativeElement.blur();
    }
  }
}
