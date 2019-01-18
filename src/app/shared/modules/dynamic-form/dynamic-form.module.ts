import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NzFormModule,
  NzSelectModule,
  NzInputModule,
  NzInputNumberModule,
  NzRadioModule,
  NzDatePickerModule,
  NzGridModule
} from 'ng-zorro-antd';
import { DynamicFormComponent } from './dynamic-form.component';

@NgModule({
  declarations: [
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzDatePickerModule,
    NzGridModule
  ],
  exports: [
    DynamicFormComponent
  ]
})
export class DynamicFormModule { }
