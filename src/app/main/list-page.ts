import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class AbstractList implements OnDestroy {

  items      = [];
  limit      = 10;
  previous   = false;
  next       = false;
  showFilter = false;
  isAdding   = false;
  subscriptions: Subscription[] = [];

  checkStatus = {
    all          : false,
    indeterminate: false
  };

  filter = {
    view     : 'list',
    limit    : this.limit,
    sortBy   : '',
    sortOrder: ''
  };

  sortMap   = {};
  cursorMap = {};

  constructor(public api: any) {}

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  buildPaginationParams(cursor, action) {
    const pagination = { action: action };
    cursor = cursor || {};
    Object.keys(this.cursorMap).forEach(key => {
      pagination[key] = cursor[this.cursorMap[key]];
    });
    Object.assign(pagination, this.filter);
    return pagination;
  }

  setPage(pagination) {
    this.api.fetch(pagination)
      .subscribe((res: any) => {
        this.items = res.items.map(p => {
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
    const cursor = this.items[0];
    const pagination = this.buildPaginationParams(cursor, 'previous');
    this.setPage(pagination);
  }

  nextPage() {
    const cursor = this.items[this.items.length - 1];
    const pagination = this.buildPaginationParams(cursor, 'next');
    this.setPage(pagination);
  }

  reloadPage() {
    if (!this.items.length) {
      this.firstPage();
      return;
    }
    const cursor = this.items[0];
    const pagination = this.buildPaginationParams(cursor, 'current');
    this.setPage(pagination);
  }

  checkAll(value: boolean) {
    this.items.forEach(reg => reg['checked'] = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked =   !this.items.length ? false : this.items.every(value =>  value['checked'] === true);
    const allUnChecked = this.items.every(value => !value['checked']);
    this.checkStatus.all = allChecked;
    this.checkStatus.indeterminate = (!allChecked) && (!allUnChecked);
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

    this.firstPage();
  }

}
