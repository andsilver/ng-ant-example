import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from 'app/app.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;
  countries = [];

  constructor(private app: AppService) {}

  ngOnInit() {
    this.countries = this.app.countries;
    this.filterForm = new FormGroup({
      filterFirstName: new FormControl(''),
      filterLastName : new FormControl(''),
      filterCountry  : new FormControl(''),
      filterAddress  : new FormControl('')
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
