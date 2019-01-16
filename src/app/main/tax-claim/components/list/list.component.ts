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

  reference: string;
  registers = [];

  constructor(
    api    : ApiService,
    private ft     : FilterService,
    private router : Router,
    private message: NzMessageService
  ) {
    super(api);
  }

  ngOnInit() {
    this.sortMap = {
      id            : null,
      reference     : null,
      register      : null,
      netAmount        : null
    };

    this.cursorMap = {
      cursorId       : 'id',
      cursorReference: 'reference',
      cursorRegister : 'register',
      cursorStatus   : 'status',
      curosrAmount   : 'netAmount'
    };

    this.subscriptions = [
      this.ft.filterChanged.subscribe(filter => {
        Object.assign(this.filter, filter);
        this.firstPage();
      }),
      this.api.getActiveTaxRegisters().subscribe((res: any) => {
        this.registers = res.items;
      })
    ];
  }

  createTaxClaim(taxClaim) {
    this.isAdding = false;
    this.api.create(taxClaim)
      .subscribe((res: any) => {
        this.message.success('A new Tax Claim is added.')
        this.toDetailsPage(res);
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
    const requests = this.items.map(p => {
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
    // this.api.exportitems()
    //   .subscribe(res => {
    //     const filename  = `items_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  // filterChanged(filter) {
  //   Object.assign(this.filter, filter);
  //   this.getTaxClaims();
  // }

  toDetailsPage(taxClaim: any) {
    this.router.navigate(['/taxes/claims', taxClaim.id]);
  }
}
