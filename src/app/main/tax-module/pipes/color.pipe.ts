import { Pipe, PipeTransform } from '@angular/core';

const COLORS = {
  ACTIVE: 'green',
  DRAFT: 'gold',
  INACTIVE: 'red'
};

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return COLORS[value] || 'white';
  }

}
