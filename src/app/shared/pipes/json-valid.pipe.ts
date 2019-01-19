import { Pipe, PipeTransform } from '@angular/core';
import { ArrayValidPipe } from './array-valid.pipe';

@Pipe({
  name: 'jsonValid'
})
export class JsonValidPipe extends ArrayValidPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!(value instanceof Object)) {
      return false;
    }
    const v = Object.keys(value).every(k => {
      if (value[k] instanceof Array) {
        return super.transform(value[k]);
      }
      return value[k];
    });
  }
}
