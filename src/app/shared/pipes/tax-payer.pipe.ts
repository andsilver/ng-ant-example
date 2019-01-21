import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxPayer'
})
export class TaxPayerPipe implements PipeTransform {

  taxPayers = [
    {
      label: 'Persons',
      value: 'NATURAL_PERSON'
    },
    {
      label: 'Entities',
      value: 'LEGAL_ENTITY'
    },
    {
      label: 'All',
      value: 'ANY'
    }
  ];

  transform(value: any, args?: any): any {
    const tp = this.taxPayers.find(t => t.value === value);
    return tp ? tp.label : '-';
  }

}
