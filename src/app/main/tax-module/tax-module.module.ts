import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './components/details/details.component';
import { FilterComponent } from './components/filter/filter.component';
import { CreateTaxModuleComponent } from './components/create-tax-module/create-tax-module.component';
import { PropertiesModalComponent } from './components/properties-modal/properties-modal.component';
import { ApprovalDateComponent } from './components/approval-date/approval-date.component';

import { ApiService } from './api/api.service';

import { StatusPipe } from './pipes/status.pipe';
import { ColorPipe } from './pipes/color.pipe';
import { DeclarationModePipe } from './pipes/declaration-mode.pipe';
import { SpecificationComponent } from './components/specification/specification.component';

const routes: Route[] = [
  {
    path: '',
    component: ListComponent
  },
  {
    path: ':code',
    component: DetailsComponent
  }
];

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    FilterComponent,
    CreateTaxModuleComponent,
    PropertiesModalComponent,
    StatusPipe,
    ColorPipe,
    ApprovalDateComponent,
    DeclarationModePipe,
    SpecificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    ApiService
  ]
})
export class TaxModuleModule { }
