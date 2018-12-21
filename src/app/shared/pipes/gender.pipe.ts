import { Pipe, PipeTransform } from '@angular/core';

const genders = {
  'MALE':   'Male',
  'FEMALE': 'Female',
  'UNKNOWN': 'Unknown'
};

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return genders[value] ? genders[value] : '';
  }

}
