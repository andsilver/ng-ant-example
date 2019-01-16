import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({providedIn: 'root'})
export class FilterService {

  filter = null;
  statuses = [];
  filterChanged: BehaviorSubject<any>;

  constructor(private api: ApiService) {
    this.statuses  = this.api.statuses;
    this.statuses.forEach(s => {
      s['checked'] = true;
    });
    this.initFilter();
    this.filterChanged = new BehaviorSubject(this.transformFilter(this.filter));
  }

  public initFilter() {
    this.filter = {
      filterRegister  : null,
      filterStatus    : this.statuses,
      filterAmountFrom: null,
      filterAmountTo  : null
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
    f['filterStatus'] = f['filterStatus'].filter(s => s.checked).map(s => s.value);
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
