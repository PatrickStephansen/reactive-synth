import { ParameterExtension, ParameterExtensionType } from './parameter-extension';
import { Observable } from 'rxjs';
import { ExtensionEvent } from './extension-event';
import { EventEmitter } from '@angular/core';

export class TriggerExtension implements ParameterExtension {
  public type = ParameterExtensionType.trigger;
  constructor(
    public eventsIn: Map<string, Observable<ExtensionEvent>>,
    public eventsOut: Map<string, EventEmitter<ExtensionEvent>>
  ) {}
}
