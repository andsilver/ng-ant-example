import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import {formatDate} from '@angular/common';
import { AppService } from 'app/app.service';
import { ApiService } from '../../api/api.service';
import { Filter } from 'app/app.models';
import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('file')
  file: any;

  naturalPersons = [];
  countries      = [];
  civilStatuses  = [];

  limit      = 10;
  next       = false;
  previous   = false;
  showFilter = false;
  registrationNumber: string;

  addingPerson = false;

  sortMap = {
    lastName : null,
    firstName: null,
    address   : null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  }

  filter = {
    limit    : this.limit,
    view     : 'list',
    sortBy   : '',
    sortOrder: ''
  }

  fileContent: any;

  constructor(
    private appService: AppService,
    private api       : ApiService,
    private router    : Router,
    private message   : NzMessageService
  ) { }

  ngOnInit() {

    this.countries     = this.appService.countries;
    this.civilStatuses = this.appService.civilStatuses;

    this.firstPage();
  }

  buildPaginationParams(cursor: any, action: string) {
    cursor = cursor || {};
    const pagination = {
      view           : 'list',
      action         : action,
      cursorId       : cursor['id'],
      cursorLastName : cursor['lastName'],
      cursorFirstName: cursor['firstName'],
      cursorAddress  : cursor['address']
    };
    Object.assign(pagination, this.filter);
    return pagination;
  }

  setPage(pagination) {
    this.api.getNaturalPersons(pagination)
      .subscribe((res: any) => {
        this.naturalPersons = res.items.map(p => {
          p['checked'] = false;
          return p;
        });
        this.previous = res.previous;
        this.next     = res.next;
        this.refreshStatus();
      });
  }

  firstPage() {
    const pagination = this.buildPaginationParams(null, 'next');
    this.setPage(pagination);
  }

  lastPage() {
    const pagination = this.buildPaginationParams(null, 'previous');
    this.setPage(pagination);
  }

  previousPage() {
    const cursor = this.naturalPersons[0];
    const pagination = this.buildPaginationParams(cursor, 'previous');
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.naturalPersons[this.naturalPersons.length - 1];
    const pagination = this.buildPaginationParams(cursor, 'next');
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.naturalPersons.length) {
      this.firstPage();
      return;
    }
    const cursor = this.naturalPersons[0];
    const pagination = this.buildPaginationParams(cursor, 'current');
    this.setPage(pagination);
  }

  createPerson(person: any) {
    this.addingPerson = false;
    this.api.createNaturalPerson(person)
      .subscribe(() => {
        this.message.success('A new person is added.')
        this.reloadPage();
      });
  }

  lookUp() {
    this.api.lookUpNaturalPerson(this.registrationNumber)
      .subscribe(res => {
        this.toDetailsPage(res);
      });
  }

  removeSelected() {
    const requests = [];
    this.naturalPersons.forEach(p => {
      if (p.checked) {
        requests.push(this.api.removeNaturalPerson(p.id));
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Persons are removed.');
        this.firstPage();
      });
  }

  exportList () {
    this.api.exportNaturalPersons()
      .subscribe(res => {
        const filename  = `NaturalPersons_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
        const content   = res.body;
        const type      = 'text/csv';
        const extension = 'csv';
        download(filename, content, type, extension);
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

  filterChanged(filter: any) {
    Object.assign(this.filter, filter);
    this.firstPage();
  }

  importList() {
    this.file.nativeElement.click();
  }

  onFileSelect() {
    const files = this.file.nativeElement.files;
    if (!files || !files.length) {
      return;
    }
    const fileToRead = files[0];
    this.api.importNaturalPersons(fileToRead)
      .subscribe(res => {
        this.message.success('Natural Persons are imported.');
        this.reloadPage();
      });
  }

  sort(sortBy: string, status: string) {
    if (status) {
      this.filter.sortBy    = sortBy;
      this.filter.sortOrder = status === 'ascend' ? 'asc' : 'desc';
    } else {
      this.filter.sortBy    = null;
      this.filter.sortOrder = null;
    }

    Object.keys(this.sortMap).forEach(key => {
      if (key === sortBy) {
        this.sortMap[key] = status;
      } else {
        this.sortMap[key] = null;
      }
    });

    this.reloadPage();
  }

  toDetailsPage(person) {
    this.router.navigate(['natural-person', person.id])
  }

}
