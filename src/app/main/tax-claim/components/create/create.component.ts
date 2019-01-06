import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { ApiService as TaxRegisterApi } from '../../../tax-register/api/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  isVisible = false;
  taxRegisters: any = [];
  selectedTaxRegister: any;
  structure: any;
  step = 0;
  submit = false;

  form: FormGroup;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.reset();
  }

  @Output()
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private taxRegisterApi: TaxRegisterApi) { }

  ngOnInit() {
    this.api.getActiveTaxRegisters()
      .subscribe(res => {
        this.taxRegisters = res;
      });
  }

  reset() {
    this.step = 0;
    this.form = this.fb.group({
      register    : this.fb.control('', [Validators.required]),
      taxPayerType: this.fb.control('NATURAL_PERSON'),
      taxPayerId  : this.fb.control(1),
      statement   : this.fb.control('ASSESSMENT')
    });
  }

  get register() {
    return this.form.get('register');
  }

  closeModal() {
    this.onCancel.emit();
    this.isVisible = false;
    return;
  }

  nextStep() {

    if (!this.form.valid) {
      for (let i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      return;
    }

    if (this.step === 0) {
      this.step = 1;
      this.taxRegisterApi.getTaxRegisterDetails(this.form.value.register)
        .subscribe(res => {
          this.selectedTaxRegister = res;
        });
      return;
    } else if (this.step === 1) {
      this.step = 2;
      this.api.loadFormData(this.selectedTaxRegister.code)
        .subscribe(res => {
          console.log(res);
          this.structure = res;
        });
      return;
    } else if (this.step === 2) {
      this.submit = true;
    }
  }

  saveModal(value) {
    if (!value) {
      this.submit = false;
      return;
    }
    let v = this.form.value;
    v['content'] = value;
    console.log(v);
    this.onConfirm.emit(v);
  }

}
