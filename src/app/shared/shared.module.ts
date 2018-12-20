import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountryPipe } from './pipes/country.pipe';

@NgModule({
  declarations: [
    CountryPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    FormsModule,
    NgZorroAntdModule,
    CountryPipe
  ]
})
export class SharedModule { }
