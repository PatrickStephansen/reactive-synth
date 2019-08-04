import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ParameterExtension } from '../../model/parameter-extension';
import { Observable } from 'rxjs';
import { ExtensionEvent } from '../../model/extension-event';

@Component({
  selector: 'app-trigger-parameter-extension',
  templateUrl: './trigger-parameter-extension.component.html',
  styleUrls: ['./trigger-parameter-extension.component.scss']
})
export class TriggerParameterExtensionComponent implements OnInit {
  @Input() extension: ParameterExtension;

  triggerChange: Observable<ExtensionEvent>;
  manualTrigger: EventEmitter<ExtensionEvent>;

  constructor() {}

  ngOnInit() {
    this.triggerChange = this.extension.eventsIn.get('trigger-change');
    this.manualTrigger = this.extension.eventsOut.get('manual-trigger');
  }

  manualTriggerOn() {
    this.manualTrigger.emit({ type: 'manual-trigger', value: true });
  }

  manualTriggerOff() {
    this.manualTrigger.emit({ type: 'manual-trigger', value: false });
  }

  eventForClickEquivalentKey(event, handler) {
    if (event.code === 'Space' || event.code === 'Enter') {
      handler.bind(this)();
    }
  }
}
