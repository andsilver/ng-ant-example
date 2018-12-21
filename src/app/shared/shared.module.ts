import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountryPipe } from './pipes/country.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { CivilStatusPipe } from './pipes/civil-status.pipe';

@NgModule({
  declarations: [
    CountryPipe,
    GenderPipe,
    CivilStatusPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    FormsModule,
    NgZorroAntdModule,
    CountryPipe,
    GenderPipe,
    CivilStatusPipe
  ]
})
export class SharedModule { }
