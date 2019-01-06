import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { DetailsComponent } from './components/details/details.component';
import { PropertiesComponent } from './components/properties/properties.component';

import { ApiService } from './api/api.service';
import { ApiService as TaxRegisterApi } from '../tax-register/api/api.service';
import { StatusPipe } from './pipes/status.pipe';
import { ColorPipe } from './pipes/color.pipe';
import { TypePipe } from './pipes/type.pipe';

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
  declarations: [ListComponent, CreateComponent, DetailsComponent, PropertiesComponent, StatusPipe, ColorPipe, TypePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    ApiService,
    TaxRegisterApi
  ]
})
export class TaxClaimModule { }
