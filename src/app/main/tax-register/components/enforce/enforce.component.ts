import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-enforce',
  templateUrl: './enforce.component.html',
  styleUrls: ['./enforce.component.scss'],
  providers: [CustomDatePipe]
})
export class EnforceComponent implements OnInit {

  isVisible = false;

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

  constructor(private fb: FormBuilder, private format: CustomDatePipe) { }

  ngOnInit() {}

  reset() {

    this.form = this.fb.group({
      date: this.fb.control('', [Validators.required]),
      name: this.fb.control('', [Validators.required])
    });
  }

  get date() {
    return this.form.get('date');
  }

  get name() {
    return this.form.get('name');
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

    let v = this.form.value;
    v.date = this.format.transform(v.date);

    this.onConfirm.emit(v);
    this.isVisible = false;
  }

}
