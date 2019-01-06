import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type'
})
export class TypePipe implements PipeTransform {

  types = [{
      label: 'Proposal',
      value: 'PROPOSAL'
    },{
      label: '',
      value: 'DECLARATION'
    },{
      label: '',
      value: 'DECLARATION_EX_OFFICIO'
    },{
      label: '',
      value: 'ASSESSMENT'
    }
  ];

  transform(value: any, args?: any): any {
    return null;
  }

}
