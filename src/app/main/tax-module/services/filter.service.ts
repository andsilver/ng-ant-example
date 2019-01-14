import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Injectable({providedIn: 'root'})
export class FilterService {

  filter = {};
  statuses = [];
  taxPayers = [];
  filterChanged: BehaviorSubject<any>;

  constructor(private api: ApiService, private date: CustomDatePipe) {
    this.taxPayers = this.api.taxPayers;
    this.statuses  = this.api.statuses;
    this.statuses.forEach(s => {
      s['checked'] = true;
    });
    this.taxPayers.forEach(t => {
      t['checked'] = true;
    });

    this.initFilter();
    this.filterChanged = new BehaviorSubject(this.transformFilter(this.filter));
  }

  private transformFilter(filter: any) {
    const f = {};
    Object.assign(f, filter);
    f['filterApprovalDateFrom'] = this.date.transform(f['filterApprovalDateFrom'], null);
    f['filterApprovalDateTo']   = this.date.transform(f['filterApprovalDateTo'], null);
    f['filterStatus']           = f['filterStatus'].filter(s => s.checked).map(s => s.value);
    f['filterTaxPayers']        = f['filterTaxPayers'].filter(t => t.checked).map(t => t.value);
    return f;
  }

  public saveFilter(filter: any) {
    this.filter = filter;
    this.filterChanged.next(this.transformFilter(this.filter));
  }

  public initFilter() {
    this.filter = {
      filterName            : null,
      filterStatus          : this.statuses,
      filterApprovalDateFrom: null,
      filterApprovalDateTo  : null,
      filterTaxPayers       : this.taxPayers
    };
  }

  public initFilterForm() {
    this.initFilter();
    return this.filterForm;
  }

  get filterForm() {
    const structure = {};
    Object.keys(this.filter).forEach(key => {
      structure[key] = new FormControl(this.filter[key]);
    });
    return new FormGroup(structure);
  }
}
