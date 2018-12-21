import { Pipe, PipeTransform } from '@angular/core';

const countries = [
  { name: 'Belgium'       , code: 'BE' },
  { name: 'France'        , code: 'FR' },
  { name: 'United Kingdom', code: 'UK' }
];

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const country = countries.find(c => c.code === value);
    return country ? country.name : value;
  }

}
