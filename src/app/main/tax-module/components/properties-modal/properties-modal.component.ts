import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss']
})
export class PropertiesModalComponent implements OnInit {

  isVisible = false;
  taxPayers = [];

  form: FormGroup;

  @Input()
  taxModule: any;

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
    console.log(this.taxModule['taxPayers'])
    this.form = this.fb.group({
      code        : this.fb.control(this.taxModule['code'],      [Validators.required]),
      name        : this.fb.control(this.taxModule['name'],      [Validators.required]),
      taxPayers   : this.fb.control(this.taxModule['taxPayers'], [Validators.required]),
      taxAuthority: this.fb.group({
        code   : this.fb.control(this.taxModule.taxAuthority['code']),
        name   : this.fb.control(this.taxModule.taxAuthority['name']),
        address: this.fb.array([
          this.fb.control(this.taxModule.taxAuthority['address'] ? this.taxModule.taxAuthority['address'][0] : ''),
          this.fb.control(this.taxModule.taxAuthority['address'] ? this.taxModule.taxAuthority['address'][1] : '')
        ])
      })
    });
  }

  get code() {
    return this.form.get('code');
  }

  get name() {
    return this.form.get('name');
  }

  get authority_name() {
    return this.form.get('taxAuthority.name');
  }

  get authority_code() {
    return this.form.get('taxAuthority.code');
  }

  get addresses() {
    const addr = this.form.get('taxAuthority.address') as FormArray;
    return addr.controls;
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

    this.onConfirm.emit(this.form.value);
    this.isVisible = false;
  }

}
