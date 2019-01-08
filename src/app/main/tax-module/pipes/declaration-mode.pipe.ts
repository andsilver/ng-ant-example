import { Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../api/api.service';

@Pipe({
  name: 'declarationMode'
})
export class DeclarationModePipe implements PipeTransform {

  declarationModes = [];

  constructor(private api: ApiService) {
    this.declarationModes = api.declarationModes;
  }

  transform(value: any, args?: any): any {
    const mode = this.declarationModes.find(s => s.value === value);
    return mode['label'] || '';
  }

}
