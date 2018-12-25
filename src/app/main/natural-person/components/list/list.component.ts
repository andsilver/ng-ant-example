import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { AppService } from 'app/app.service';
import { Filter } from 'app/app.models';
import * as _ from 'app/shared/helpers/utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ DatePipe ]
})
export class ListComponent implements OnInit {

  naturalPersons = [];
  filter: Filter;

  page       = 1;
  limit      = 10;
  total      = 10;
  showFilter = false;
  registrationNumber: string;

  sortMap = {
    last_name : null,
    first_name: null,
    address   : null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  }

  addingPerson = false;

  constructor(
    private appService: AppService,
    private router    : Router,
    private message   : NzMessageService,
    private datePipe  : DatePipe
  ) { }

  ngOnInit() {

    this.filter = {
      offset    : this.offset,
      limit     : this.limit,
      first_name: '',
      last_name : '',
      sort_by   : '',
      sort_order: '',
      address   : ''
    };

    this.getPersons();
  }

  getPersons() {
    this.appService.filterNaturalPersons(this.filter)
      .subscribe((res: any)=> {
        this.naturalPersons = res.map(p => {
          p['checked']            = false;
          p['registrationNumber'] = '';
          return p;
        });
        this.refreshStatus();
        this.total = this.naturalPersons.length;
      });
  }

  createPerson(person) {
    this.addingPerson = false;
    this.appService.createNaturalPerson(person)
      .subscribe(() => {
        this.message.success('A new person is added.')
        this.getPersons();
      });
  }

  lookUp() {
    this.appService.lookUpNaturalPerson(this.registrationNumber)
      .subscribe(res => {
        this.toDetailsPage(res);
      });
  }

  removeSelected() {
    const requests = this.naturalPersons.map(p => {
      if (p.checked) {
        return this.appService.removeNaturalPerson(p.id);
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Persons are removed.');
        this.getPersons();
      });
  }

  exportList () {
    this.appService.exportNaturalPersons()
      .subscribe(res => {
        
        const filename  = `NaturalPersons_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
        const content   = res.body;
        const type      = 'text/csv';
        const extension = 'csv';

        _.download(filename, content, type, extension);
      });
  }

  checkAll(value: boolean) {
    this.naturalPersons.forEach(person => person['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   !this.naturalPersons.length ? false : this.naturalPersons.every(value =>  value['checked'] === true);
    const allUnChecked = this.naturalPersons.every(value => !value['checked']);
    this.checkStatus.all = allChecked;
    this.checkStatus.indeterminate = (!allChecked) && (!allUnChecked);
  }

  filterChanged(filter) {
    Object.assign(this.filter, filter);
    this.getPersons();
  }

  sort(sort_by, status) {
    if (status) {
      this.filter.sort_by    = sort_by;
      this.filter.sort_order = status === 'ascend' ? 'asc' : 'desc';
    } else {
      this.filter.sort_by    = null;
      this.filter.sort_order = null;
    }

    Object.keys(this.sortMap).forEach(key => {
      if (key === sort_by) {
        this.sortMap[key] = status;
      } else {
        this.sortMap[key] = null;
      }
    });

    this.getPersons();
  }

  pageChanged(page) {
    console.log(page);
  }

  toDetailsPage(person) {
    this.router.navigate(['natural-person', person.id])
  }

  get offset() {
    return (this.page - 1) * this.limit + 1;
  }

}
