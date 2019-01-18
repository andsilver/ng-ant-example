import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

interface DynamicFormField {
  name: string;
  label: string;
  optional: boolean;
  value: any;
}

interface DynamicFormStructure {
  name: string;
  fields: DynamicFormField[];
}

interface FormConfig {
  value: any;
  valid: boolean;
  validation: boolean;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnDestroy {

  @Input()
  value: any;

  @Input()
  set control(form: FormConfig) {
    this._control = form;
    if (this._control.validation) {
      this.validation(this.form);
    }
  }

  @Input()
  set structure(structure: DynamicFormStructure) {
    if (!structure || !structure.fields.length) {
      return;
    }
    this._structure = structure;
    this.form = this.setDynamicForm(this.structure.fields, this.value || {});
    this.removeSubscriptions();
    this.subscriptions.push(this.form.valueChanges.subscribe((res) => this.exportControl()));
    setTimeout(() => this.exportControl(), 1000);
  }

  get structure() {
    return this._structure;
  }

  get control() {
    return this._control;
  }

  @Output()
  controlChange = new EventEmitter();

  form: FormGroup;
  _structure: DynamicFormStructure;
  _control: FormConfig;
  optionalFields = [];
  subscriptions: Subscription[] = [];
  TRUE  = true;
  FALSE = false;

  constructor(private fb: FormBuilder, private dateFormat: CustomDatePipe) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.removeSubscriptions();
  }

  exportControl() {
    const v = this.form.value;
    const dates = this.structure.fields.filter(f => f.value.type === 'date');
    dates.forEach(date => v[date.name] = this.dateFormat.transform(v[date.name]));
    this.optionalFields.forEach(f => delete v[f]);
    this.controlChange.emit({value: v, validation: this._control.validation, valid: this.form.valid});
  }

  removeSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  formArrayControls(form: FormGroup | FormArray) {
    const array = form as FormArray;
    return array.controls;
  }

  addField(form: FormArray) {
    form.push(this.fb.control(null, [Validators.required]));
  }

  removeField(form: FormArray, index: number) {
    form.removeAt(index);
  }

  validation(form: FormGroup | FormArray) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
      if (control instanceof FormGroup) {
       this.validation(control);
      } else if (control instanceof FormArray) {
        this.formArrayControls(control).forEach(c => {
          c.markAsDirty();
          c.updateValueAndValidity();
        });
      }
    });
  }

  toggleDisable(field: DynamicFormField, enable: any) {
    const name = field.name;
    enable ? this.form.get(name).enable() : this.form.get(name).disable();
  }

  setOptionControl(structure: any, field: DynamicFormField, control: FormGroup | FormArray | FormControl) {
    if (field.optional) {
      const _name = `option_${field.name}`;
      this.optionalFields.push(_name);
      structure[_name] = this.fb.control(true);
    } else {
      control.setValidators([Validators.required]);
    }
    return control;
  }

  setDynamicForm(fields: DynamicFormField[], object: any = {}) {
    const structure = {};
    fields.forEach(field => {

      switch (field.value.type) {

        case 'composite':
          const group = this.setDynamicForm(field.value.fields, {});
          structure[field.name] = this.setOptionControl(structure, field, group);
          break;

        case 'list':
          const array = this.fb.array([this.fb.control(null, [Validators.required])]);
          structure[field.name] = this.setOptionControl(structure, field, array);
          break;

        default:
          const control = this.fb.control(object[field.name]);
          structure[field.name] = this.setOptionControl(structure, field, control);
          break;
      }
    });
    return this.fb.group(structure);
  }

  decimalStep(decimals: number) {
    return 1 / Math.pow(10, decimals);
  }

}
