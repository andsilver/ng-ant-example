import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  taxRegisters    = [];

  limit             = 10;
  previous          = false;
  next              = false;
  showFilter        = false;
  addingTaxRegister = false;

  code: string;

  sortMap = {
    code          : null,
    name          : null,
    status        : null,
    taxModule     : null,
    taxYear       : null,
    accountingYear: null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  }

  filter = {
    limit          : this.limit,
    sortBy         : '',
    sortOrder      : ''
  };

  constructor(
    private api    : ApiService,
    private router : Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.firstPage();
  }

  buildPaginationParams(cursor, action) {
    cursor = cursor || {};
    const pagination = {
      view                : 'list',
      action              : action,
      cursorCode          : cursor['code'],
      cursorName          : cursor['name'],
      cursorTaxModule     : cursor['taxModule'],
      cursorTaxYear       : cursor['taxYear'],
      curosrAccountingYear: cursor['accountingYear']
    };
    Object.assign(pagination, this.filter);
    return pagination;
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.taxRegisters = res.items.map(p => {
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
    const cursor = this.taxRegisters[0];
    const pagination = this.buildPaginationParams(cursor, 'previous');
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.taxRegisters[this.taxRegisters.length - 1];
    const pagination = this.buildPaginationParams(cursor, 'next');
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.taxRegisters.length) {
      this.firstPage();
      return;
    }
    const cursor = this.taxRegisters[0];
    const pagination = this.buildPaginationParams(cursor, 'current');
    this.setPage(pagination);
  }

  createTaxRegister(taxRegister) {
    this.addingTaxRegister = false;
    this.api.createTaxRegister(taxRegister)
      .subscribe(() => {
        this.message.success('A new Tax Register is added.')
        this.reloadPage();
      });
  }

  lookUp() {
    this.api.getTaxRegisterDetails(this.code)
      .subscribe(res => {
        if (res) {
          this.toDetailsPage(res);
        } else {
          this.message.warning('Tax Register not found!');
        }
      });
  }

  removeSelected() {
    const requests = this.taxRegisters.map(p => {
      if (p.checked) {
        return this.api.removeTaxRegister(p.code);
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Tax Registers are removed.');
        this.firstPage();
      });
  }

  exportList () {
    // this.api.exporttaxRegisters()
    //   .subscribe(res => {
    //     const filename  = `taxRegisters_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  checkAll(value: boolean) {
    this.taxRegisters.forEach(reg => reg['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   !this.taxRegisters.length ? false : this.taxRegisters.every(value =>  value['checked'] === true);
    const allUnChecked = this.taxRegisters.every(value => !value['checked']);
    this.checkStatus.all = allChecked;
    this.checkStatus.indeterminate = (!allChecked) && (!allUnChecked);
  }

  filterChanged(filter) {
    Object.assign(this.filter, filter);
    this.firstPage();
  }

  sort(sortBy, status) {
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

    this.firstPage();
  }

  pageChanged(page) {
    console.log(page);
  }

  toDetailsPage(taxRegister) {
    this.router.navigate(['/taxes/registers', taxRegister.code])
  }
}
