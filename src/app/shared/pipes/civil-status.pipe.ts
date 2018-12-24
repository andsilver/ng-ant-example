import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from 'app/app.service';

@Pipe({
  name: 'civilStatus'
})
export class CivilStatusPipe implements PipeTransform {

  civilStatuses = [];

  constructor(private appService: AppService) {
    this.civilStatuses = this.appService.civilStatuses;
  }

  transform(value: any, args?: any): any {
    const civil = this.civilStatuses.find( c => c.value === value );
    return civil ? civil.label : '';
  }

}
