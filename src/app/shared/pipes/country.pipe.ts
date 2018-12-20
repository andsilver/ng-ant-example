import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  countries = [
    {
      name: 'Belgium', code: 'BE'
    }
  ]

  transform(value: any, args?: any): any {
    const country = this.countries.find(c => c.code === value);
    return country ? country.name : value;
  }

}
