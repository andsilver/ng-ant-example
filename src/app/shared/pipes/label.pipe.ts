import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  transform(value: string): any {
    let text = value[0].toUpperCase() + value.substr(1);
    return text.replace( /([a-z])([A-Z])/g, "$1 $2");
  }

}
