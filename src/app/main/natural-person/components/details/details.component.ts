import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import {formatDate} from '@angular/common';
import { AppService } from 'app/app.service';
import { ApiService } from '../../api/api.service';
import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  person            : any;
  registrationNumber: string;

  editingStatus = {
    properties        : false,
    residentialAddress: false,
    correspondence    : false
  };

  civilStatuses = [];
  countries     = [];
  addingPerson  = false;

  constructor(
    private route     : ActivatedRoute,
    private appService: AppService,
    private api       : ApiService,
    private message   : NzMessageService,
    private router    : Router
  ) { }

  ngOnInit() {
    this.civilStatuses = this.appService.civilStatuses;
    this.countries     = this.appService.countries;
    this.route.params.subscribe(res => {
      this.api.getNaturalPerson(res['id'])
      .subscribe(res => {
        this.person = res;
      });
    })
  }

  createPerson(person) {
    this.addingPerson = false;
    this.api.createNaturalPerson(person)
      .subscribe(res => {
        this.message.success('A new person is added.')
        this.router.navigate(['/natural-person', res['id']]);
      });
  }

  removePerson() {
    this.api.removeNaturalPerson(this.person.id)
      .subscribe(res => {
        this.message.success('The person is removed.');
        this.router.navigate(['/natural-person']);
      });
  }

  showEditModal(type: string) {
    this.editingStatus[type] = true;
  }

  updateProperties(properties) {
    this.editingStatus.properties = false;
    this.api.updateNaturalPersonProperties(this.person.id, properties)
      .subscribe(res => {
        this.person = res;
        this.message.success('Properties are updated.');
      })
  }

  updateResidentialAddress (address) {
    this.editingStatus.residentialAddress = false;

    if (!address) {
      this.deleteResidentialAddress();
      return;
    }

    this.api.updateNaturalPersonResidentialAddress(this.person.id, address)
      .subscribe(res => {
        this.person = res;
        this.message.success('Residential Address is updated.')
      });
  }

  deleteResidentialAddress() {
    this.api.eraseNaturalPersonResidentialAddress(this.person.id)
      .subscribe(res => {
        this.person = res;
        this.message.success('Residential Address is deleted.');
      });
  }

  updateCorrespondenceAddress (address) {
    this.editingStatus.correspondence = false;

    if (!address) {
      this.deleteCorrespondenceAddress();
      return;
    }

    this.api.updateNaturalPersonCorrespondenceAddress(this.person.id, address)
      .subscribe(() => {
        this.message.success('Correspondence Address is updated.')
      });
  }

  deleteCorrespondenceAddress() {
    this.api.eraseNaturalPersonCorrespondenceAddress(this.person.id)
      .subscribe(res => {
        this.person = res;
        this.message.success('Correspondence Address is deleted.');
      });
  }

  lookUp() {
    this.api.lookUpNaturalPerson(this.registrationNumber)
      .subscribe(res => {
        if (!res) {
          this.message.success('Not found.');
        }
        this.router.navigate(['/natural-person', res['id']]);
      });
  }

  exportList () {
    this.api.exportNaturalPersons()
      .subscribe(res => {
        const filename  = `NaturalPersons_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
        const content   = res.body;
        const type      = 'text/csv';
        const extension = 'csv';
        download(filename, content, type, extension);
      });
  }

}
