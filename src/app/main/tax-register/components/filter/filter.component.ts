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
      name              : new FormControl(''),
      status            : new FormControl(this.statuses),
      taxModule         : new FormControl(''),
      taxYearFrom       : new FormControl(''),
      taxYearTo         : new FormControl(''),
      accountingYearFrom: new FormControl(''),
      accountingYearTo  : new FormControl('')
    });
  }

  applyFilter() {
    const filter = this.filterForm.value;
    filter.taxYearFrom        = formatDate(filter.taxYearFrom, 'yyyy', 'en');
    filter.taxYearTo          = formatDate(filter.taxYearTo, 'yyyy', 'en');
    filter.accountingYearFrom = formatDate(filter.accountingYearFrom, 'yyyy', 'en');
    filter.accountingYearTo   = formatDate(filter.accountingYearTo, 'yyyy', 'en');
    this.filterChanged.emit(filter);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
