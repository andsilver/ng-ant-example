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

  taxModules = [];

  previous        = false;
  next            = false;
  showFilter      = false;
  addingTaxModule = false;

  code: string;

  sortMap = {
    code        : null,
    name        : null,
    approvalDate: null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  };

  filter = {
    limit                 : 10,
    sortBy                : '',
    sortOrder             : '',
    filterName            : '',
    filterStatus          : [],
    filterApprovalDateFrom: '',
    filterApprovalDateTo  : '',
    filterTaxPayers       : []
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
      view              : 'page',
      action            : action,
      cursorCode        : cursor['code'],
      cursorName        : cursor['name'],
      cursorApprovalDate: cursor['approvalDate']
    };
    Object.assign(pagination, this.filter);
    return pagination;
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.taxModules = res.items.map(p => {
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
    const cursor = this.taxModules[0];
    const pagination = this.buildPaginationParams(cursor, 'previous');
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.taxModules[this.taxModules.length - 1];
    const pagination = this.buildPaginationParams(cursor, 'next');
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.taxModules.length) {
      this.firstPage();
      return;
    }
    const cursor = this.taxModules[0];
    const pagination = this.buildPaginationParams(cursor, 'current');
    this.setPage(pagination);
  }

  createTaxModule(taxModule) {
    this.addingTaxModule = false;
    this.api.createTaxModule(taxModule)
      .subscribe(() => {
        this.message.success('A new Tax Module is added.')
        this.reloadPage();
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
        this.reloadPage();
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
    this.firstPage();
  }

  sort(sort_by, status) {
    if (status) {
      this.filter.sortBy    = sort_by;
      this.filter.sortOrder = status === 'ascend' ? 'asc' : 'desc';
    } else {
      this.filter.sortBy    = null;
      this.filter.sortOrder = null;
    }

    Object.keys(this.sortMap).forEach(key => {
      if (key === sort_by) {
        this.sortMap[key] = status;
      } else {
        this.sortMap[key] = null;
      }
    });

    this.firstPage();
  }

  toDetailsPage(taxModule) {
    this.router.navigate(['/taxes/module', taxModule.code]);
  }
}
