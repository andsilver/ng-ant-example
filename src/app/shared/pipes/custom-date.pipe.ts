import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { AppSettings } from 'app/app-settings';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private settings: AppSettings){}

  transform(value: any, def = '-'): any {
    return value ? formatDate(value, this.settings.date_format, this.settings.locale) : def;
  }

}
