import { fromEventPattern } from 'rxjs';
import { map } from 'rxjs/operators';

export const observableFromMessagePort = (port: MessagePort) =>
  fromEventPattern<MessageEvent>(
    handler => port.addEventListener('message', handler),
    handler => port.removeEventListener('message', handler)
  ).pipe(map(message => message.data));
