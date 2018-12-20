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
  countries = [{
      name: 'United States',
      code: 'us'
    }, {
      name: 'United Kingdom',
      code: 'uk'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.filterForm = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      country: new FormControl(''),
      address: new FormControl('')
    });
  }

  get firstName() {
    return this.filterForm.get('first_name');
  }

  get lastName() {
    return this.filterForm.get('last_name');
  }

  get country() {
    return this.filterForm.get('country');
  }

  get address() {
    return this.filterForm.get('address');
  }

  applyFilter() {
    this.filterChanged.emit(this.filterForm.value);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
