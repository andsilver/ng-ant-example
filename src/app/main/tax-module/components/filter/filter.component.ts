import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [CustomDatePipe]
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;

  taxPayers = [];
  statuses  = [];

  constructor(private filter: FilterService) { }

  ngOnInit() {
    this.taxPayers = this.filter.taxPayers;
    this.statuses  = this.filter.statuses;
    this.filterForm = this.filter.filterForm;
  }

  reset() {
    this.filterForm = this.filter.initFilterForm();
  }

  applyFilter() {
    const filter = this.filterForm.value;
    this.filter.saveFilter(filter);
  }

  clearFilter() {
    this.reset();
    const filter = this.filterForm.value;
    this.filter.saveFilter(filter);
  }

}
