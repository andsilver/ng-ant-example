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
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

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
      this.onCancel.emit();
      this.isVisible = false;
      return;
    }

    if (!this.form.valid && save) {
      for (let i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      return;
    }

    let v = this.form.value;
    v.taxYear        = Number(formatDate(v.taxYear, 'yyyy', 'en'));
    v.accountingYear = Number(formatDate(v.accountingYear, 'yyyy', 'en'));

    console.log(v);

    this.onConfirm.emit(v);
    this.isVisible = false;
  }

}
