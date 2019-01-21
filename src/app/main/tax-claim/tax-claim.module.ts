import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { DetailsComponent } from './components/details/details.component';
import { PropertiesComponent } from './components/properties/properties.component';

import { StatusPipe } from './pipes/status.pipe';
import { ColorPipe } from './pipes/color.pipe';
import { TypePipe } from './pipes/type.pipe';
import { FilterComponent } from './components/filter/filter.component';
import { AssessmentPipe } from './pipes/assessment.pipe';

const routes: Route[] = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: ':id',
    component: DetailsComponent
  }
];

@NgModule({
  declarations: [ListComponent, CreateComponent, DetailsComponent, PropertiesComponent, StatusPipe, ColorPipe, TypePipe, FilterComponent, AssessmentPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TaxClaimModule { }
