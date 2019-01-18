import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../services/api.service';
import { ApiService as TaxRegisterApi } from '../../../tax-register/services/api.service';
import { DynamicFormService } from 'app/shared/modules/dynamic-form/dynamic-form.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

interface DynamicForm {
  form: any;
  object: any;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [CustomDatePipe]
})
export class CreateComponent implements OnInit {

  isVisible      = false;
  taxRegisters   = [];
  taxPayerTypes  = [];
  naturalPersons = [];
  legalEntities  = [];
  selectedTaxRegister: any;
  step   = 0;
  fields = [];

  optionalFields = [];

  form: FormGroup;
  dynamicForm: DynamicForm;
  dfControl: any;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.reset();
  }

  @Output()
  cancel = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private trApi: TaxRegisterApi,
    private format: CustomDatePipe,
    private message: NzMessageService,
    private dfs: DynamicFormService
  ) { }

  ngOnInit() {
    this.taxPayerTypes = [this.api.taxPayerTypes[0], this.api.taxPayerTypes[1]];
    this.api.getActiveTaxRegisters()
      .subscribe((res: any) => {
        this.taxRegisters = res.items;
      });
  }

  reset() {
    this.step = 0;
    this.form = this.fb.group({
      register    : this.fb.control(null, [Validators.required]),
      taxPayerType: this.fb.control(null, [Validators.required]),
      taxPayerId  : this.fb.control(null, [Validators.required]),
      statement   : this.fb.control('ASSESSMENT')
    });
  }

  validation(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  get register() {
    return this.form.get('register');
  }

  get taxPayerId() {
    return this.form.get('taxPayerId');
  }

  get taxPayerType() {
    return this.form.get('taxPayerType');
  }

  closeModal() {
    this.cancel.emit();
    this.isVisible = false;
    return;
  }

  nextStep() {

    switch (this.step) {

      case 0:
        if (this.register.invalid) {
          this.register.markAsDirty();
          this.register.updateValueAndValidity();
          return;
        }
        forkJoin([
          this.trApi.get(this.form.value.register),
          this.api.getNaturalPersons()
        ])
        .subscribe((ress: any) => {
          if (!ress[0]) {
            this.message.error('Selected Tax Register is not exist.');
            return;
          }
          this.step = 1;
          this.selectedTaxRegister = ress[0];
          this.naturalPersons = ress[1].items.map(item => {
            return {
              value: item['id'],
              label: item['firstName'] + ' ' + item['lastName']
            };
          });
        });
      break;

      case 1:
        if (this.taxPayerId.invalid || this.taxPayerType.invalid) {
          this.validation(this.form);
          return;
        }
        this.trApi.loadFormData(this.selectedTaxRegister.code).subscribe((res: any) => {
          this.dynamicForm = res;
          this.dfControl = { value: '', validation: false };
          this.step = 2;
        });
      break;

      case 2:
        console.log(this.dfControl);
        if (!this.dfControl.valid) {
          this.dfControl.validation = true;
          return;
        } else {
          const taxClaim = this.form.value;
          taxClaim['content'] = this.dfControl.value;
          this.confirm.emit(taxClaim);
        }
      break;
    }
  }

}
