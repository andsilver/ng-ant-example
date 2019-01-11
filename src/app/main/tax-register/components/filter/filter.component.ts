import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;

  statuses  = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.statuses  = this.api.statuses;
    this.statuses.forEach(s => {
      s['checked'] = true;
    });
    this.filterForm = new FormGroup({
      filterName              : new FormControl(''),
      filterStatus            : new FormControl(this.statuses),
      filterTaxModule         : new FormControl(''),
      filterTaxYearFrom       : new FormControl(''),
      filterTaxYearTo         : new FormControl(''),
      filterAccountingYearFrom: new FormControl(''),
      filterAccountingYearTo  : new FormControl('')
    });
  }

  applyFilter() {
    const filter = this.filterForm.value;
    filter.filterTaxYearFrom        = formatDate(filter.filterTaxYearFrom, 'yyyy', 'en');
    filter.filterTaxYearTo          = formatDate(filter.filterTaxYearTo, 'yyyy', 'en');
    filter.filterAccountingYearFrom = formatDate(filter.filterAccountingYearFrom, 'yyyy', 'en');
    filter.filterAccountingYearTo   = formatDate(filter.filterAccountingYearTo, 'yyyy', 'en');
    this.filterChanged.emit(filter);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
