import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import {formatDate} from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  isVisible = false;
  taxModules = [];

  form: FormGroup;

  @Input()
  taxRegister: any;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.reset();
  }

  @Output()
  cancel = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.api.getActiveTaxModules()
      .subscribe((res: any) => {
        this.taxModules = res.items;
      });
  }

  reset() {

    this.form = this.fb.group({
      code          : this.fb.control(this.taxRegister.code, [Validators.required]),
      name          : this.fb.control(this.taxRegister.name, [Validators.required]),
      taxModule     : this.fb.control(this.taxRegister.taxModule.code, [Validators.required]),
      taxYear       : this.fb.control(new Date(this.taxRegister.taxYear, 0), [Validators.required]),
      accountingYear: this.fb.control(new Date(this.taxRegister.accountingYear, 0), [Validators.required])
    });
  }

  get code() {
    return this.form.get('code');
  }

  get name() {
    return this.form.get('name');
  }

  get taxModule() {
    return this.form.get('taxModule');
  }

  get taxYear() {
    return this.form.get('taxYear');
  }

  get accountingYear() {
    return this.form.get('accountingYear');
  }

  closeModal(save) {

    if (!save) {
      this.cancel.emit();
      this.isVisible = false;
      return;
    }

    if (!this.form.valid && save) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      });
      return;
    }

    const v = this.form.value;
    v.taxYear = Number(formatDate(v.taxYear, 'yyyy', 'en'));
    v.accountingYear = Number(formatDate(v.accountingYear, 'yyyy', 'en'));

    this.confirm.emit(v);
    this.isVisible = false;
  }

}
