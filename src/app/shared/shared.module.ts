import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountryPipe } from './pipes/country.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { CivilStatusPipe } from './pipes/civil-status.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';

@NgModule({
  declarations: [
    CountryPipe,
    GenderPipe,
    CivilStatusPipe,
    CustomDatePipe
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
    CustomDatePipe
  ]
})
export class SharedModule { }
