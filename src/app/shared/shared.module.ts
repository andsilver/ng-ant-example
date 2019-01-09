import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CountryPipe } from './pipes/country.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { CivilStatusPipe } from './pipes/civil-status.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { TaxPayerPipe } from './pipes/tax-payer.pipe';
import { LabelPipe } from './pipes/label.pipe';

import { CodeEditorComponent } from './components/code-editor/code-editor.component';

@NgModule({
  declarations: [
    CountryPipe,
    GenderPipe,
    CivilStatusPipe,
    CustomDatePipe,
    TaxPayerPipe,
    LabelPipe,
    CodeEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MonacoEditorModule.forRoot()
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
    LabelPipe,
    CodeEditorComponent
  ]
})
export class SharedModule { }
