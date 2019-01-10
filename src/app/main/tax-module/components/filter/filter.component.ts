import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../api/api.service';
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

  constructor(private api: ApiService, private date: CustomDatePipe) { }

  ngOnInit() {
    this.taxPayers = this.api.taxPayers;
    this.statuses  = this.api.statuses;
    this.statuses.forEach(s => {
      s['checked'] = true;
    });
    this.taxPayers.forEach(t => {
      t['checked'] = true;
    })
    this.filterForm = new FormGroup({
      filterName            : new FormControl(''),
      filterStatus          : new FormControl(this.statuses),
      filterApprovalDateFrom: new FormControl(''),
      filterApprovalDateTo  : new FormControl(''),
      filterTaxPayers       : new FormControl(this.taxPayers)
    });
  }

  applyFilter() {
    const filter = this.filterForm.value;
    filter.filterApprovalDateFrom = this.date.transform(filter.filterApprovalDateFrom, null);
    filter.filterApprovalDateTo   = this.date.transform(filter.filterApprovalDateTo, null);
    filter.filterStatus           = filter.filterStatus.filter(s => s.checked).map(s => s.value);
    filter.filterTaxPayers        = filter.filterTaxPayers.filter(t => t.checked).map(t => t.value);
    this.filterChanged.emit(filter);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
