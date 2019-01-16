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
  valueField: string;

  @Input()
  labelField: string;

  @Input()
  set data(data) {
    let options;
    if (!this.valueField && !this.labelField) {
      options = data.map(d => {
        return {value: d, label: d};
      });
    } else {
      options = data.map(d => {
        return {value: d[this.valueField], label: d[this.labelField]};
      });
    }
    if (this.options.length) {
      this.propagateChange(null);
      this.writeValue(null);
    }
    this.options = options;
    this.filteredOptions = this.options;
  }

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

  ngModelChanged(value: string) {
    const option = this.filteredOptions.find(op => op.value === value);
    if (!option) {
      this.propagateChange(null);
      this.writeValue(null);
    } else {
      this.propagateChange(value);
      this.writeValue(value)
    }
  }

  onInput(label: string) {
    this.filteredOptions = this.options.filter(option => option.label.toLowerCase().indexOf(label.toLowerCase()) === 0);
  }

}
