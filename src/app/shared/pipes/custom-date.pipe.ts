import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { AppSettings } from 'app/app-settings';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private settings: AppSettings) {}

  transform(value: any, def = '-', format: string = null): any {
    return value ? formatDate(value, format || this.settings.date_format, this.settings.locale) : def;
  }

}
