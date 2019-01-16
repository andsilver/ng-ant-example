import { Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../services/api.service';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  statuses = [];

  constructor(private api: ApiService) {
    this.statuses = api.statuses;
  }

  transform(value: any, args?: any): any {
    const status = this.statuses.find(s => s.value === value);
    return status['label'] || '';
  }

}
