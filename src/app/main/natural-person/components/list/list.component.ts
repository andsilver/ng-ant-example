import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AppService } from 'app/app.service';
import { Filter } from 'app/app.models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  naturalPersons = [];
  filter: Filter;

  page  = 1;
  limit = 10;
  total = 10;
  showFilter = false;
  registrationNumber: number;

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
    private message   : NzMessageService
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
      .subscribe(res => {
        this.message.success('A new person is added.')
        this.getPersons();
      });
  }

  checkAll(value: boolean) {
    this.naturalPersons.forEach(person => person['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   this.naturalPersons.every(value =>  value['checked'] === true);
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
