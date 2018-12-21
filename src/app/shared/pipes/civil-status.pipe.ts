import { Pipe, PipeTransform } from '@angular/core';

const civilStatuses = {
  'SINGLE': 'Single',
  'MARRIED': 'Married',
  'DIVORCED': 'Divorced',
  'WIDOWED': 'Widowed'
};

@Pipe({
  name: 'civilStatus'
})
export class CivilStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return civilStatuses[value] ? civilStatuses[value] : '';
  }

}
