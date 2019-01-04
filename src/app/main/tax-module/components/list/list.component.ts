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

  filter: any;
  taxModules = [];

  page            = 1;
  limit           = 10;
  total           = 10;
  showFilter      = false;
  addingTaxModule = false;

  code: string;

  sortMap = {
    code        : null,
    name        : null,
    status      : null,
    approvalDate: null,
    taxPayers   : null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  }

  constructor(
    private api    : ApiService,
    private router : Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.filter = {
      offset             : this.offset,
      limit              : this.limit,
      tax_payers         : [],
      approval_date_from : '',
      approval_date_to   : '',
      sort_by            : '',
      sort_order         : '',
      address            : '',
      status             : ''
    };

    this.getTaxModules();
  }

  getTaxModules() {
    this.api.filterTaxModules(this.filter)
      .subscribe((res: any)=> {
        this.taxModules = res.map(p => {
          p['checked'] = false;
          return p;
        });
        this.refreshStatus();
        this.total = this.taxModules.length;
      });
  }

  createTaxModule(taxModule) {
    this.addingTaxModule = false;
    this.api.createTaxModule(taxModule)
      .subscribe(() => {
        this.message.success('A new Tax Module is added.')
        this.getTaxModules();
      });
  }

  lookUp() {
    this.api.getTaxModule(this.code)
      .subscribe(res => {
        if (res) {
          this.toDetailsPage(res);
        } else {
          this.message.warning('Tax Module not found!');
        }
      });
  }

  removeSelected() {
    const requests = this.taxModules.map(p => {
      if (p.checked) {
        return this.api.removeTaxModule(p.code);
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Tax Modules are removed.');
        this.getTaxModules();
      });
  }

  exportList () {
    // this.api.exporttaxModules()
    //   .subscribe(res => {
    //     const filename  = `taxModules_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  checkAll(value: boolean) {
    this.taxModules.forEach(module => module['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   !this.taxModules.length ? false : this.taxModules.every(value =>  value['checked'] === true);
    const allUnChecked = this.taxModules.every(value => !value['checked']);
    this.checkStatus.all = allChecked;
    this.checkStatus.indeterminate = (!allChecked) && (!allUnChecked);
  }

  filterChanged(filter) {
    Object.assign(this.filter, filter);
    this.getTaxModules();
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

    this.getTaxModules();
  }

  pageChanged(page) {
    console.log(page);
  }

  toDetailsPage(taxModule) {
    this.router.navigate(['tax-module', taxModule.code]);
  }

  get offset() {
    return (this.page - 1) * this.limit + 1;
  }
}
