import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import {formatDate} from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.reset();
  }

  @Input()
  taxModules: any = [];

  @Output()
  cancel = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  isVisible = false;

  form: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit() {}

  reset() {

    this.form = this.fb.group({
      code          : this.fb.control('', [Validators.required]),
      name          : this.fb.control('', [Validators.required]),
      taxModule     : this.fb.control('', [Validators.required]),
      taxYear       : this.fb.control('', [Validators.required]),
      accountingYear: this.fb.control('', [Validators.required])
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
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      });
      return;
    }

    const v = this.form.value;
    v.taxYear        = Number(formatDate(v.taxYear, 'yyyy', 'en'));
    v.accountingYear = Number(formatDate(v.accountingYear, 'yyyy', 'en'));

    this.confirm.emit(v);
    this.isVisible = false;
  }

}
