import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from 'app/app.service';

@Pipe({
  name: 'taxPayer'
})
export class TaxPayerPipe implements PipeTransform {

  taxPayers = [
    {
      label: 'Natural Person',
      value: 'NATURAL_PERSON'
    },
    {
      label: 'Legal Entity',
      value: 'LEGAL_ENTITY'
    },
    {
      label: 'Both',
      value: 'ANY'
    }
  ];

  transform(value: any, args?: any): any {
    const tp = this.taxPayers.find(t => t.value === value);
    return tp ? tp.label : '-';
  }

}
