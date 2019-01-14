import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../api/api.service';
// import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  taxClaims    = [];

  limit             = 10;
  next              = false;
  previous          = false;
  showFilter        = false;
  addingTaxClaim    = false;

  reference: string;

  sortMap = {
    id       : null,
    reference: null,
    register : null,
    status   : null,
    netAmount: null
  };

  checkStatus = {
    all          : false,
    indeterminate: false
  }

  filter = {
    view     : 'list',
    limit    : this.limit,
    sortBy   : '',
    sortOrder: ''
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
      action            : action,
      cursorId        : cursor['id'],
      cursorReference : cursor['reference'],
      cursorRegister  : cursor['register'],
      cursorStatus    : cursor['status'],
      cursorAmount    : cursor['amount']
    };
    Object.assign(pagination, this.filter);
    return pagination;
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.taxClaims = res.items.map(p => {
          p['checked'] = false;
          return p;
        });
        console.log(this.taxClaims);
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
    const cursor = this.taxClaims[0];
    const pagination = this.buildPaginationParams(cursor, 'previous');
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.taxClaims[this.taxClaims.length - 1];
    const pagination = this.buildPaginationParams(cursor, 'next');
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.taxClaims.length) {
      this.firstPage();
      return;
    }
    const cursor = this.taxClaims[0];
    const pagination = this.buildPaginationParams(cursor, 'current');
    this.setPage(pagination);
  }

  createTaxClaim(taxClaim) {
    this.addingTaxClaim = false;
    this.api.create(taxClaim)
      .subscribe(() => {
        this.message.success('A new Tax Claim is added.')
        this.reloadPage();
      });
  }

  lookUp() {
    this.api.lookUp(this.reference)
      .subscribe(res => {
        if (res) {
          this.toDetailsPage(res);
        } else {
          this.message.warning('Tax Claim not found!');
        }
      });
  }

  removeSelected() {
    const requests = this.taxClaims.map(p => {
      if (p.checked) {
        return this.api.remove(p.code);
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected Tax Claims are removed.');
        this.firstPage();
      });
  }

  exportList () {
    // this.api.exporttaxClaims()
    //   .subscribe(res => {
    //     const filename  = `taxClaims_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  checkAll(value: boolean) {
    this.taxClaims.forEach(reg => reg['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   !this.taxClaims.length ? false : this.taxClaims.every(value =>  value['checked'] === true);
    const allUnChecked = this.taxClaims.every(value => !value['checked']);
    this.checkStatus.all = allChecked;
    this.checkStatus.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // filterChanged(filter) {
  //   Object.assign(this.filter, filter);
  //   this.getTaxClaims();
  // }

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

    this.reloadPage();
  }

  toDetailsPage(taxClaim) {
    this.router.navigate(['/taxes/claims', taxClaim.id]);
  }
}
