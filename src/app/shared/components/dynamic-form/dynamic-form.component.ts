import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input()
  structure: any;

  @Input()
  set submit(submit: boolean) {
    if (submit) {
      if (!this.form.valid) {
        for (let i in this.form.controls) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
        this.onSubmit.emit(false);
      } else {
        this.onSubmit.emit(this.form.value);
      }
    }
  }

  @Output()
  onSubmit = new EventEmitter();

  form: FormGroup;
  fields = [];
  object = {};

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const structure = {};
    this.fields = this.structure['fields'];
    this.object = this.structure['object'];
    this.fields.forEach(field => {
      structure[field.name] = this.fb.control(this.object[field.name], field.optional ? [] : [Validators.required]);
    });

    this.form = this.fb.group(structure);
  }

}
