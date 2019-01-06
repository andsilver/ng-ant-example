import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../../api/api.service';

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
  }

  reset() {
    this.propertiesForm = this.fb.group({
      code        : this.fb.control(this.taxModule['code'],      [Validators.required]),
      name        : this.fb.control(this.taxModule['name'],      [Validators.required]),
      taxPayers   : this.fb.control(this.taxModule['taxPayers'], [Validators.required])
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
