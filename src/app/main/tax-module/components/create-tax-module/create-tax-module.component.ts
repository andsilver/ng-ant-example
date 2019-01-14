import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-tax-module',
  templateUrl: './create-tax-module.component.html',
  styleUrls: ['./create-tax-module.component.scss'],
})
export class CreateTaxModuleComponent implements OnInit {

  isVisible = false;
  taxPayers = [];
  dModes    = [];

  propertiesForm  : FormGroup;
  taxAuthorityForm: FormGroup;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.reset();
  }

  @Output()
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.taxPayers = this.api.taxPayers;
    this.dModes    = this.api.declarationModes;
  }

  reset() {
    this.propertiesForm = this.fb.group({
      code           : this.fb.control('', [Validators.required]),
      name           : this.fb.control('', [Validators.required]),
      taxPayers      : this.fb.control('', [Validators.required]),
      declarationMode: this.fb.control('NO_DECLARATION', [Validators.required]),
    });

    this.taxAuthorityForm = this.fb.group({
      code   : this.fb.control(''),
      name   : this.fb.control(''),
      address: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ])
    });
  }

  get code() {
    return this.propertiesForm.get('code');
  }

  get name() {
    return this.propertiesForm.get('name');
  }

  get declarationMode() {
    return this.propertiesForm.get('declarationMode');
  }

  get authority_name() {
    return this.taxAuthorityForm.get('name');
  }

  get authority_code() {
    return this.taxAuthorityForm.get('code');
  }

  get addresses() {
    const addr = this.taxAuthorityForm.get('address') as FormArray;
    return addr.controls;
  }

  closeModal(save) {

    if (!save) {
      this.onCancel.emit();
      this.isVisible = false;
      return;
    }

    if (!this.propertiesForm.valid && save) {
      for (let i in this.propertiesForm.controls) {
        this.propertiesForm.controls[i].markAsDirty();
        this.propertiesForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const v = this.propertiesForm.value;
    v['taxAuthority'] = this.taxAuthorityForm.value;

    this.onConfirm.emit(this.propertiesForm.value);
    this.isVisible = false;
  }

}
