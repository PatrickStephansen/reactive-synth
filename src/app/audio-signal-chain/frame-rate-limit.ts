import { ExtensionEvent } from './model/extension-event';
import { sampleTime } from 'rxjs/operators';

export const frameRateLimit = sampleTime<ExtensionEvent>(1000 / 144);
