import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss']
})
export class PropertiesModalComponent {

  @Input()
  properties: any;

  @Input()
  civilStatuses = [];

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    if (visible == true ) {
      this.setForm();
    }
  }

  @Output()
  onCancel  = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  form: FormGroup;
  isVisible = false;
  genders       = ['MALE', 'FEMALE', 'UNKNOWN'];

  constructor() { }

  setForm() {
    this.form = new FormGroup({
      lastName:           new FormControl(this.properties ? this.properties.lastName           : '', [Validators.required]),
      firstName:          new FormControl(this.properties ? this.properties.firstName          : '', [Validators.required]),
      registrationNumber: new FormControl(this.properties ? this.properties.registrationNumber : ''),
      gender:             new FormControl(this.properties ? this.properties.gender             : '', [Validators.required]),
      civilStatus:        new FormControl(this.properties ? this.properties.civilStatus        : '', [Validators.required]),
      dateOfBirth:        new FormControl(this.properties ? this.properties.dateOfBirth        : ''),
      dateOfDeath:        new FormControl(this.properties ? this.properties.dateOfDeath        : '')
    });

  }

  closeModal(save) {

    if (!this.form.valid && save) {
      for (const i in this.form.controls) {
        this.form.controls[ i ].markAsDirty();
        this.form.controls[ i ].updateValueAndValidity();
      }
      return;
    }

    this.isVisible = false;
    save ? this.onConfirm.emit(this.form.value) : this.onCancel.emit()
  }

}
