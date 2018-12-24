import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from 'app/app.service';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  countries = [];

  constructor(private appService: AppService) {
    this.countries = this.appService.countries;
  }

  transform(value: any, args?: any): any {
    const country = this.countries.find(c => c.value === value);
    return country ? country.label : value;
  }

}
