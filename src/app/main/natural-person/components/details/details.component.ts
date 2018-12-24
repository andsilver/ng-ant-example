import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { AppService } from 'app/app.service';

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
    private message   : NzMessageService,
    private router    : Router
  ) { }

  ngOnInit() {
    this.civilStatuses = this.appService.civilStatuses;
    this.countries     = this.appService.countries;
    this.route.params.subscribe(res => {
      this.appService.getNaturalPerson(res['id'])
      .subscribe(res => {
        this.person = res;
      });
    })
  }

  createPerson(person) {
    this.addingPerson = false;
    this.appService.createNaturalPerson(person)
      .subscribe(res => {
        this.message.success('A new person is added.')
        this.router.navigate(['/natural-person', res['id']]);
      });
  }

  removePerson() {
    this.appService.removeNaturalPerson(this.person.id)
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
    Object.assign(this.person, properties);
    properties['id'] = this.person.id;

    this.appService.updateNaturalPersonProperties(properties)
      .subscribe(() => {
        this.message.success('Properties are updated.');
      })
  }

  updateResidentialAddress (address) {
    this.editingStatus.residentialAddress = false;

    if (!address) {
      this.deleteResidentialAddress();
      return;
    }

    this.person.residentialAddress = address;
    address['id'] = this.person.id;

    this.appService.updateNaturalPersonResidentialAddress(address)
      .subscribe(() => {
        this.message.success('Residential Address is updated.')
      });
  }

  deleteResidentialAddress() {
    this.person.residentialAddress = null;
    this.appService.eraseNaturalPersonResidentialAddress(this.person.id)
      .subscribe(() => {
        this.message.success('Residential Address is deleted.');
      });
  }

  updateCorrespondenceAddress (address) {
    this.editingStatus.correspondence = false;

    if (!address) {
      this.deleteCorrespondenceAddress();
      return;
    }

    this.person.correspondenceAddress = address;
    address['id'] = this.person.id;

    this.appService.updateNaturalPersonCorrespondenceAddress(address)
      .subscribe(() => {
        this.message.success('Correspondence Address is updated.')
      });
  }

  deleteCorrespondenceAddress() {
    this.person.correspondenceAddress = null;
    this.appService.eraseNaturalPersonCorrespondenceAddress(this.person.id)
      .subscribe(() => {
        this.message.success('Correspondence Address is deleted.');
      });
  }

  lookUp() {
    this.appService.lookUpNaturalPerson(this.registrationNumber)
      .subscribe(res => {
        this.router.navigate(['/natural-person', res['id']]);
      });
  }

}
