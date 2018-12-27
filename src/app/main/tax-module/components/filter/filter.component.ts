import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;

  taxPayers = [];
  statuses  = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.taxPayers = this.api.taxPayers;
    this.statuses  = this.api.statuses;
    this.filterForm = new FormGroup({
      status            : new FormControl(''),
      approval_date_from: new FormControl(''),
      approval_date_to  : new FormControl(''),
      tax_payers        : new FormControl('')
    });
  }

  applyFilter() {
    const filter = this.filterForm.value;
    if (filter['tax_payers'] === 'ANY') {
      filter['tax_payers'] = [this.taxPayers[0].value, this.taxPayers[1].value];
    }
    this.filterChanged.emit(filter);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
