import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { formatDate } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'app/app.service';
import { ApiService } from '../../services/api.service';
import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  person: any;
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
    private route: ActivatedRoute,
    private appService: AppService,
    private api: ApiService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.civilStatuses = this.appService.civilStatuses;
    this.countries     = this.appService.countries;
    this.route.params
      .pipe(
        switchMap(params => {
          const id = params['id'];
          return this.api.get(id);
        })
      )
      .subscribe(res => {
        this.person = res;
        if (!this.person) {
          this.message.error('Person does not exist.');
          this.router.navigate(['/parties/persons']);
          return;
        }
      });
  }

  createPerson(person) {
    this.addingPerson = false;
    this.api.create(person)
      .subscribe(res => {
        this.message.success('A new person is added.');
        this.router.navigate(['/parties/persons', res['id']]);
      });
  }

  removePerson() {
    this.api.remove(this.person.id)
      .subscribe(() => {
        this.message.success('The person is removed.');
        this.router.navigate(['/parties/persons']);
      });
  }

  showEditModal(type: string) {
    this.editingStatus[type] = true;
  }

  updateProperties(properties) {
    this.editingStatus.properties = false;
    this.api.update(this.person.id, properties)
      .subscribe(res => {
        this.person = res;
        this.message.success('Properties are updated.');
      });
  }

  updateResidentialAddress (address) {
    this.editingStatus.residentialAddress = false;

    if (!address) {
      this.deleteResidentialAddress();
      return;
    }

    this.api.updateResidentialAddress(this.person.id, address)
      .subscribe(res => {
        this.person = res;
        this.message.success('Residential address is updated.');
      });
  }

  deleteResidentialAddress() {
    this.api.eraseResidentialAddress(this.person.id)
      .subscribe(res => {
        this.person = res;
        this.message.success('Residential address is deleted.');
      });
  }

  updateCorrespondenceAddress (address) {
    this.editingStatus.correspondence = false;

    if (!address) {
      this.deleteCorrespondenceAddress();
      return;
    }

    this.api.updateCorrespondenceAddress(this.person.id, address)
      .subscribe(() => {
        this.message.success('Correspondence address is updated.');
      });
  }

  deleteCorrespondenceAddress() {
    this.api.eraseCorrespondenceAddress(this.person.id)
      .subscribe(res => {
        this.person = res;
        this.message.success('Correspondence address is deleted.');
      });
  }

  lookUp() {
    this.api.lookUp(this.registrationNumber)
      .subscribe(res => {
        if (!res) {
          this.message.success('Not found.');
        }
        this.router.navigate(['/parties/persons', res['id']]);
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

}
