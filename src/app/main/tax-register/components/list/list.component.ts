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
  taxRegisters    = [];

  page              = 1;
  limit             = 10;
  total             = 10;
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

  constructor(
    private api    : ApiService,
    private router : Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.filter = {
      offset             : this.offset,
      limit              : this.limit,
      tax_module         : '',
      sort_by            : '',
      sort_order         : ''
    };

    this.getTaxRegisters();
  }

  getTaxRegisters() {
    this.api.filterTaxRegister(this.filter)
      .subscribe((res: any)=> {
        this.taxRegisters = res.map(p => {
          p['checked'] = false;
          return p;
        });
        this.refreshStatus();
        this.total = this.taxRegisters.length;
      });
  }

  createTaxRegister(taxRegister) {
    this.addingTaxRegister = false;
    this.api.createTaxRegister(taxRegister)
      .subscribe(() => {
        this.message.success('A new Tax Register is added.')
        this.getTaxRegisters();
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
        this.getTaxRegisters();
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
    this.getTaxRegisters();
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

    this.getTaxRegisters();
  }

  pageChanged(page) {
    console.log(page);
  }

  toDetailsPage(taxRegister) {
    this.router.navigate(['/taxes/register', taxRegister.code])
  }

  get offset() {
    return (this.page - 1) * this.limit + 1;
  }
}
