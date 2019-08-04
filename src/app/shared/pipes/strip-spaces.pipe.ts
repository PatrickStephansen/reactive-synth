import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripSpaces'
})
export class StripSpacesPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    return value.replace(/\s/g, '');
  }
}
