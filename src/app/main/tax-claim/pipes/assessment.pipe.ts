import { Pipe, PipeTransform } from '@angular/core';

const assessments = [
  {
    label: 'Assessment',
    value: 'ASSESSMENT'
  }
];

@Pipe({
  name: 'assessment'
})
export class AssessmentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const assessment = assessments.find(ass => ass.value === value);
    return assessment ? assessment.label : null;
  }

}
