import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;
  countries = ['UK', 'BE', 'FR'];

  constructor() { }

  ngOnInit() {
    this.filterForm = new FormGroup({
      first_name: new FormControl(''),
      last_name : new FormControl(''),
      country   : new FormControl(''),
      address   : new FormControl('')
    });
  }

  applyFilter() {
    this.filterChanged.emit(this.filterForm.value);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
