import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ExtensionEvent } from './extension-event';

export interface ParameterExtension {
  type: ParameterExtensionType;
  eventsIn: Map<string, Observable<ExtensionEvent>>;
  eventsOut: Map<string, EventEmitter<ExtensionEvent>>;
}

export enum ParameterExtensionType {
  trigger = 'trigger'
}
