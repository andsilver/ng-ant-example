import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteComponent),
    multi: true
  }]
})
export class AutocompleteComponent implements ControlValueAccessor {

  @Input()
  set data(data) {
    if (!this.valueField && !this.labelField) {
      this.options = data.map(d => {
        return {value: d, label: d};
      });
    } else {
      this.options = data.map(d => {
        return {value: d[this.valueField], label: d[this.labelField]};
      });
    }
    this.filteredOptions = this.options;
  }

  @Input()
  valueField: string;

  @Input()
  labelField: string;

  value: string;
  label: string;

  options         = [];
  filteredOptions = [];

  constructor() { }

  propagateChange = (_: any) => {};

  writeValue(value: string) {
    this.value = value;
    const option = this.filteredOptions.find(op => op.value === value);
    this.label = option ? option.label : null;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  ngModelChanged(value) {
    this.writeValue(value);
    if (this.label) {
      this.propagateChange(this.value);
    }
  }

  onInput(label) {
    this.filteredOptions = this.options.filter(option => option.label.toLowerCase().indexOf(label.toLowerCase()) === 0);
  }

}
