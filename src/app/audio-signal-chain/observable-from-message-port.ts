import { fromEventPattern } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export const observableFromMessagePort = (port: MessagePort, eventType: string) =>
  fromEventPattern<MessageEvent>(
    handler => port.addEventListener('message', handler),
    handler => port.removeEventListener('message', handler)
  ).pipe(
    map(message => message.data),
    filter(message => message.type === eventType)
  );
