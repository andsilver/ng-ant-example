import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { FilterComponent } from './components/filter/filter.component';
import { DetailsComponent } from './components/details/details.component';
import { ListComponent } from './components/list/list.component';
import { PropertiesModalComponent } from './components/properties-modal/properties-modal.component';
import { AddressModalComponent } from './components/address-modal/address-modal.component';
import { CreatePersonModalComponent } from './components/create-person-modal/create-person-modal.component';

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
  declarations: [
    FilterComponent,
    DetailsComponent,
    ListComponent,
    PropertiesModalComponent,
    AddressModalComponent,
    CreatePersonModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class NaturalPersonModule { }
