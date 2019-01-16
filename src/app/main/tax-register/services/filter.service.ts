import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Injectable({providedIn: 'root'})
export class FilterService {

  filter = {};
  statuses = [];
  filterChanged: BehaviorSubject<any>;

  constructor(private api: ApiService, private date: CustomDatePipe) {
    this.statuses  = this.api.statuses;
    this.statuses.forEach(s => {
      s['checked'] = true;
    });
    this.initFilter();
    this.filterChanged = new BehaviorSubject(this.transformFilter(this.filter));
  }

  public initFilter() {
    this.filter = {
      filterName              : null,
      filterStatus            : this.statuses,
      filterTaxModule         : null,
      filterTaxYearFrom       : null,
      filterTaxYearTo         : null,
      filterAccountingYearFrom: null,
      filterAccountingYearTo  : null
    };
  }

  public initFilterForm() {
    this.initFilter();
    return this.form;
  }

  public saveFilter(filter: any) {
    this.filter = filter;
    this.filterChanged.next(this.transformFilter(this.filter));
  }

  private transformFilter(filter: any) {
    const f = {};
    Object.assign(f, filter);
    f['filterTaxYearFrom']        = this.date.transform(f['filterTaxYearFrom'], null, 'yyyy');
    f['filterTaxYearTo']          = this.date.transform(f['filterTaxYearTo'],   null, 'yyyy');
    f['filterAccountingYearFrom'] = this.date.transform(f['filterAccountingYearFrom'], null, 'yyyy');
    f['filterAccountingYearTo']   = this.date.transform(f['filterAccountingYearTo'],   null, 'yyyy');
    f['filterStatus']             = f['filterStatus'].filter(s => s.checked).map(s => s.value);
    return f;
  }

  get form() {
    const structure = {};
    Object.keys(this.filter).forEach(key => {
      structure[key] = new FormControl(this.filter[key]);
    });
    return new FormGroup(structure);
  }
}
