import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../services/api.service';
import { ApiService as TaxRegisterApi } from '../../../tax-register/services/api.service';
import { ApiService as NaturalPersonApi } from '../../../natural-person/services/api.service';

interface DynamicForm {
  form: any;
  object: any;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
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
    private npApi: NaturalPersonApi,
    private message: NzMessageService,
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

  getTaxPayers(searchTerm: string) {
    if (!searchTerm) {
      this.naturalPersons = [];
      return;
    }
    const fullName = searchTerm.split(' ');
    const firstName = fullName[0] || null;
    const lastName = fullName.length > 1 ? fullName[1] : null;
    localStorage.setItem('showLoading', 'no');
    this.npApi.fetch({
      action: 'next',
      view: 'list',
      limit: 50,
      filterFirstName: firstName,
      filterLastName : lastName
    })
    .subscribe((res: any) => {
      localStorage.setItem('showLoading', null);
      this.naturalPersons = res.items.map(item => {
        return {
          value: item['id'],
          label: item['firstName'] + ' ' + item['lastName']
        };
      });
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
        this.trApi.get(this.form.value.register)
          .subscribe((res: any) => {
            if (!res) {
              this.message.error('Selected Tax Register is not exist.');
              return;
            }
            this.step = 1;
            this.selectedTaxRegister = res;
            this.naturalPersons = [];
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
