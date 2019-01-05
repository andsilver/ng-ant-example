import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountryPipe } from './pipes/country.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { CivilStatusPipe } from './pipes/civil-status.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { TaxPayerPipe } from './pipes/tax-payer.pipe';

@NgModule({
  declarations: [
    CountryPipe,
    GenderPipe,
    CivilStatusPipe,
    CustomDatePipe,
    DynamicFormComponent,
    TaxPayerPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CountryPipe,
    GenderPipe,
    CivilStatusPipe,
    CustomDatePipe,
    TaxPayerPipe,
    DynamicFormComponent
  ]
})
export class SharedModule { }
