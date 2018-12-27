import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-create-tax-module',
  templateUrl: './create-tax-module.component.html',
  styleUrls: ['./create-tax-module.component.scss']
})
export class CreateTaxModuleComponent implements OnInit {

  isVisible = false;
  taxPayers = [];

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

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit() {
    this.taxPayers = this.api.taxPayers;
  }

  reset() {
    this.form = this.fb.group({
      code        : this.fb.control('', [Validators.required]),
      name        : this.fb.control('', [Validators.required]),
      taxPayers   : this.fb.control('', [Validators.required]),
      taxAuthority: this.fb.group({
        code   : this.fb.control(''),
        name   : this.fb.control(''),
        address: this.fb.array([
          this.fb.control(''),
          this.fb.control('')
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

    console.log(this.form.value);

    this.onConfirm.emit(this.form.value);
    this.isVisible = false;
  }

}
