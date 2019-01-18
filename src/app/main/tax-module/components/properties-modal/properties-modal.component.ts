import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss']
})
export class PropertiesModalComponent implements OnInit {

  @Input()
  taxModule: any;

  isVisible = false;
  taxPayers = [];
  dModes    = [];

  propertiesForm:   FormGroup;
  taxAuthorityForm: FormGroup;

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
    this.taxPayers = this.api.taxPayers;
    this.dModes    = this.api.declarationModes;
  }

  reset() {
    this.propertiesForm = this.fb.group({
      code           : this.fb.control(this.taxModule['code'],            [Validators.required]),
      name           : this.fb.control(this.taxModule['name'],            [Validators.required]),
      taxPayers      : this.fb.control(this.taxModule['taxPayers'],       [Validators.required]),
      declarationMode: this.fb.control(this.taxModule['declarationMode'], [Validators.required])
    });

    this.taxAuthorityForm = this.fb.group({
      code   : this.fb.control(this.taxModule.taxAuthority['code']),
      name   : this.fb.control(this.taxModule.taxAuthority['name']),
      address: this.fb.array([
        this.fb.control(this.taxModule.taxAuthority['address'] ? this.taxModule.taxAuthority['address'][0] : ''),
        this.fb.control(this.taxModule.taxAuthority['address'] ? this.taxModule.taxAuthority['address'][1] : ''),
        this.fb.control(this.taxModule.taxAuthority['address'] ? this.taxModule.taxAuthority['address'][2] : '')
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
      this.cancel.emit();
      this.isVisible = false;
      return;
    }

    if (!this.propertiesForm.valid && save) {
      Object.keys(this.propertiesForm.controls).forEach((key) => {
        this.propertiesForm.controls[key].markAsDirty();
        this.propertiesForm.controls[key].updateValueAndValidity();
      });
      return;
    }

    const v = this.propertiesForm.value;
    v['taxAuthority'] = this.taxAuthorityForm.value;

    this.confirm.emit(this.propertiesForm.value);
    this.isVisible = false;
  }

}
