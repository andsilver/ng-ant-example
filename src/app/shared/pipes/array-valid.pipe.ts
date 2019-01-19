import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayValid'
})
export class ArrayValidPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!(value instanceof Array)) {
      return false;
    }
    if (!value.length) {
      return false;
    }
    const v = value.every(i => i);
    return v;
  }

}
