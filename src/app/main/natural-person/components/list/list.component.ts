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

  filter: Filter;
  naturalPersons = [];
  countries      = [];
  civilStatuses  = [];

  page       = 1;
  limit      = 10;
  next       = false;
  previous   = false;
  total      = 10;
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

    this.filter = {
      offset    : this.offset,
      limit     : this.limit,
      first_name: '',
      last_name : '',
      sort_by   : '',
      sort_order: '',
      address   : ''
    };

    // this.getPersons();
    this.firstPage();
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.naturalPersons = res.items.map(p => {
          p['checked']            = false;
          // p['registrationNumber'] = '';
          return p;
        });
        this.previous = res.previous;
        this.next     = res.next;
        this.refreshStatus();
      });
  }

  firstPage() {
    const pagination = {
      action: 'next',
      limit : this.limit,
      sort  : {
        column: this.filter.sort_by,
        order : this.filter.sort_order
      },
      cursor: null
    };
    this.setPage(pagination);
  }

  lastPage() {
    const pagination = {
      action: 'previous',
      limit : this.limit,
      sort  : {
        column: this.filter.sort_by,
        order : this.filter.sort_order
      },
      cursor: null
    };
    this.setPage(pagination);
  }

  previousPage() {
    const cursor = this.naturalPersons[0];
    delete cursor['checked'];
    const pagination = {
      action: 'previous',
      limit : this.limit,
      sort  : {
        column: this.filter.sort_by,
        order : this.filter.sort_order
      },
      cursor: cursor
    };
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.naturalPersons[this.naturalPersons.length - 1];
    delete cursor['checked'];
    const pagination = {
      action: 'next',
      limit : this.limit,
      sort  : {
        column: this.filter.sort_by,
        order : this.filter.sort_order
      },
      cursor: cursor
    };
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.naturalPersons.length) {
      this.firstPage();
      return;
    }
    const cursor = this.naturalPersons[0];
    delete cursor['checked'];
    const pagination = {
      action: 'current',
      limit : this.limit,
      sort  : {
        column: this.filter.sort_by,
        order : this.filter.sort_order
      },
      cursor: cursor
    };
    this.setPage(pagination);
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
        this.reloadPage();
      });
  }

  lookUp() {
    this.appService.lookUpNaturalPerson(this.registrationNumber)
      .subscribe(res => {
        this.toDetailsPage(res);
      });
  }

  removeSelected() {
    const requests = [];
    this.naturalPersons.forEach(p => {
      if (p.checked) {
        requests.push(this.appService.removeNaturalPerson(p.id));
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Persons are removed.');
        this.firstPage();
      });
  }

  exportList () {
    this.appService.exportNaturalPersons()
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

  filterChanged(filter) {
    Object.assign(this.filter, filter);
    this.getPersons();
  }

  importList() {
    this.file.nativeElement.click();
  }

  onFileSelect() {
    const files = this.file.nativeElement.files;
    console.log(files);
    if (!files || !files.length) {
      return;
    }
    const fileToRead = files[0];
    this.api.importFile(fileToRead)
      .subscribe(res => {
        this.message.success('Natural Persons are imported.');
        this.reloadPage();
      });
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

    this.reloadPage();
  }

  toDetailsPage(person) {
    this.router.navigate(['natural-person', person.id])
  }

  get offset() {
    return (this.page - 1) * this.limit + 1;
  }

}
