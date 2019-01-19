import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';

import { CountryPipe } from './pipes/country.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { CivilStatusPipe } from './pipes/civil-status.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { TaxPayerPipe } from './pipes/tax-payer.pipe';
import { LabelPipe } from './pipes/label.pipe';

import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ArrayValidPipe } from './pipes/array-valid.pipe';
import { JsonValidPipe } from './pipes/json-valid.pipe';

@NgModule({
  declarations: [
    CountryPipe,
    GenderPipe,
    CivilStatusPipe,
    CustomDatePipe,
    TaxPayerPipe,
    LabelPipe,
    CodeEditorComponent,
    FileSizePipe,
    AutocompleteComponent,
    PaginationComponent,
    ArrayValidPipe,
    JsonValidPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MonacoEditorModule
  ],
  providers: [
    CustomDatePipe
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
    FileSizePipe,
    CodeEditorComponent,
    AutocompleteComponent,
    PaginationComponent,
    DynamicFormModule,
    ArrayValidPipe,
    JsonValidPipe
  ]
})
export class SharedModule { }
