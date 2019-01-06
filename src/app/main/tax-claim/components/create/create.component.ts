import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ApiService as TaxRegisterApi } from '../../../tax-register/api/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [CustomDatePipe]
})
export class CreateComponent implements OnInit {

  isVisible = false;
  taxRegisters: any = [];
  selectedTaxRegister: any;
  step   = 0;
  fields = [];

  form       : FormGroup;
  dynamicForm: FormGroup;

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
    private taxRegisterApi: TaxRegisterApi,
    private format: CustomDatePipe) { }

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
    } else if (this.step === 1) {
      this.step = 2;
      this.api.loadFormData(this.selectedTaxRegister.code)
        .subscribe(res => {
          const structure = {};
          const object = res['object'];
          this.fields = res['fields'];
          this.fields.forEach(field => {
            structure[field.name] = this.fb.control(object[field.name], field.optional ? [] : [Validators.required]);
          });
          this.dynamicForm = this.fb.group(structure);
        });
    } else if (this.step === 2) {
      if (!this.dynamicForm.valid) {
        for (let i in this.dynamicForm.controls) {
          this.dynamicForm.controls[i].markAsDirty();
          this.dynamicForm.controls[i].updateValueAndValidity();
        }
        return;
      } else {
        const dates = this.fields.filter(f => f.value.type === 'date');
        const v = this.dynamicForm.value;
        dates.forEach(date => {
          v[date.name] = this.format.transform(v[date.name]);
        });
        const taxClaim = this.form.value;
        taxClaim['content'] = v;
        this.onConfirm.emit(taxClaim);
      }
    }
  }

}
