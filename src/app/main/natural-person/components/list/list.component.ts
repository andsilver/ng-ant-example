import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import {formatDate} from '@angular/common';
import { AppService } from 'app/app.service';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { download } from 'app/shared/helpers/utils';
import { AbstractList } from 'app/main/list-page';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends AbstractList implements OnInit {

  @ViewChild('file')
  file: any;

  countries      = [];
  civilStatuses  = [];
  registrationNumber: string;
  fileContent: any;

  constructor(
    api       : ApiService,
    private ft        : FilterService,
    private appService: AppService,
    private router    : Router,
    private message   : NzMessageService
  ) {
    super(api);
  }

  ngOnInit() {
    this.countries     = this.appService.countries;
    this.civilStatuses = this.appService.civilStatuses;

    this.sortMap = {
      lastName : null,
      firstName: null,
      address   : null
    };

    this.cursorMap = {
      cursorId       : 'id',
      cursorLastName : 'lastName',
      cursorFirstName: 'firstName',
      cursorAddress  : 'address'
    };

    this.subscriptions = [
      this.ft.filterChanged.subscribe(filter => {
        Object.assign(this.filter, filter);
        this.firstPage();
      })];
  }

  createPerson(person: any) {
    this.isAdding = false;
    this.api.create(person)
      .subscribe(() => {
        this.message.success('A new person is added.')
        this.reloadPage();
      });
  }

  lookUp() {
    this.api.lookUp(this.registrationNumber)
      .subscribe(res => {
        this.toDetailsPage(res);
      });
  }

  removeSelected() {
    const requests = [];
    this.items.forEach(p => {
      if (p.checked) {
        requests.push(this.api.remove(p.id));
      }
    });

    forkJoin(requests)
      .subscribe(() => {
        this.message.success('Selected persons are removed.');
        this.firstPage();
      });
  }

  exportList () {
    this.api.exports()
      .subscribe(res => {
        const filename  = `NaturalPersons_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
        const content   = res.body;
        const type      = 'text/csv';
        const extension = 'csv';
        download(filename, content, type, extension);
      });
  }

  importList() {
    this.file.nativeElement.click();
  }

  onFileSelect() {
    const files = this.file.nativeElement.files;
    if (!files || !files.length) {
      return;
    }
    const fileToRead = files[0];
    this.api.imports(fileToRead)
      .subscribe(res => {
        this.message.success('Natural persons are imported.');
        this.reloadPage();
      });
  }

  toDetailsPage(person) {
    this.router.navigate(['/parties/persons', person.id])
  }

}
