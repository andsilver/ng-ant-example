import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateComponent } from './components/create/create.component';
import { FilterComponent } from './components/filter/filter.component';
import { ColorPipe } from './pipes/color.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { EnforceComponent } from './components/enforce/enforce.component';
import { PropertiesComponent } from './components/properties/properties.component';

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
  declarations: [ListComponent, DetailsComponent, CreateComponent, FilterComponent, ColorPipe, StatusPipe, EnforceComponent, PropertiesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TaxRegisterModule { }
