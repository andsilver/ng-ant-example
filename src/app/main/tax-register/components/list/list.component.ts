import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';

import { AbstractList } from 'app/main/list-page';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends AbstractList implements OnInit {

  taxModules = [];
  code: string;

  constructor(
    api: ApiService,
    private ft     : FilterService,
    private router : Router,
    private message: NzMessageService
  ) {
    super(api);
  }

  ngOnInit() {

    this.sortMap = {
      code          : null,
      name          : null,
      status        : null,
      taxModule     : null,
      taxYear       : null,
      accountingYear: null
    };

    this.cursorMap = {
      cursorCode          : 'code',
      cursorName          : 'name',
      cursorTaxModule     : 'taxModule',
      cursorTaxYear       : 'taxYear',
      curosrAccountingYear: 'accountingYear'
    };

    this.subscriptions = [
      this.ft.filterChanged.subscribe(filter => {
        Object.assign(this.filter, filter);
        this.firstPage();
      }),
      this.api.getActiveTaxModules().subscribe(res => {
        this.taxModules = res['items'];
      })
    ];
  }

  createTaxRegister(taxRegister) {
    this.isAdding = false;
    this.api.create(taxRegister)
      .subscribe((res) => {
        this.message.success('A new Tax Register is added.')
        this.toDetailsPage(res);
      });
  }

  lookUp() {
    this.api.get(this.code)
      .subscribe(res => {
        if (res) {
          this.toDetailsPage(res);
        } else {
          this.message.warning('Tax Register not found!');
        }
      });
  }

  removeSelected() {
    const requests = this.items.map(p => {
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
    // this.api.exportitems()
    //   .subscribe(res => {
    //     const filename  = `items_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }


  toDetailsPage(taxRegister) {
    this.router.navigate(['/taxes/registers', taxRegister.code])
  }
}
