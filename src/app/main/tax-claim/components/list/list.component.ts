import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../api/api.service';
// import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  filter: any;
  taxClaims    = [];

  page              = 1;
  limit             = 10;
  total             = 10;
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

  constructor(
    private api    : ApiService,
    private router : Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.filter = {
      offset             : this.offset,
      limit              : this.limit,
      sort_by            : '',
      sort_order         : ''
    };

    this.firstPage();
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.taxClaims = res.items.map(p => {
          p['checked']            = false;
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
    const cursor = this.taxClaims[0];
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
    const cursor = this.taxClaims[this.taxClaims.length - 1];
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
    if (!this.taxClaims.length) {
      this.firstPage();
      return;
    }
    const cursor = this.taxClaims[0];
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
          this.message.warning('Tax Register not found!');
        }
      });
  }

  removeSelected() {
    // const requests = this.taxClaims.map(p => {
    //   if (p.checked) {
    //     return this.api.removeTaxClaim(p.code);
    //   }
    // });

    // forkJoin(requests)
    //   .subscribe(() => {
    //     this.message.success('Selected Tax Registers are removed.');
    //     this.getTaxClaims();
    //   });
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

  toDetailsPage(taxClaim) {
    this.router.navigate(['tax-claim', taxClaim.id]);
  }

  get offset() {
    return (this.page - 1) * this.limit + 1;
  }
}
