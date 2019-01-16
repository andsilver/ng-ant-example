import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  form: FormGroup;

  taxPayers = [];
  statuses  = [];

  constructor(private filter: FilterService) { }

  ngOnInit() {
    this.taxPayers = this.filter.taxPayers;
    this.statuses  = this.filter.statuses;
    this.form = this.filter.form;
  }

  reset() {
    this.form = this.filter.initFilterForm();
  }

  applyFilter() {
    const filter = this.form.value;
    this.filter.saveFilter(filter);
  }

  clearFilter() {
    this.reset();
    const filter = this.form.value;
    this.filter.saveFilter(filter);
  }

}
