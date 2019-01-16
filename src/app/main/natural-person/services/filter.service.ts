import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FilterService {

  filter = {};
  filterChanged: BehaviorSubject<any>;

  constructor() {
    this.initFilter();
    this.filterChanged = new BehaviorSubject(this.filter);
  }

  public initFilter() {
    this.filter = {
      filterFirstName: null,
      filterLastName : null,
      filterCountry  : null,
      filterAddress  : null
    };
  }

  public initFilterForm() {
    this.initFilter();
    return this.form;
  }

  public saveFilter(filter: any) {
    this.filter = filter;
    this.filterChanged.next(this.filter);
  }

  get form() {
    const structure = {};
    Object.keys(this.filter).forEach(key => {
      structure[key] = new FormControl(this.filter[key]);
    });
    return new FormGroup(structure);
  }
}
