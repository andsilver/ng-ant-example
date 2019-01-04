import { Pipe, PipeTransform } from '@angular/core';

const COLORS = {
  ENFORCEABLE: 'green',
  DRAFT      : 'gold',
  CLOSED     : 'red'
};

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return COLORS[value] || 'white';
  }

}
