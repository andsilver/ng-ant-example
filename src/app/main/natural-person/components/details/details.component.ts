import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { AppService } from 'app/app.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  person: any;
  registrationNumber: number;
  propertiesForm: FormGroup;
  residentalAddressForm: FormGroup;
  correspondenceAddressForm: FormGroup;

  editionStatus = {
    properties: false,
    residentalAddress: false,
    correspondence: false
  };

  constructor(
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.appService.getNaturalPerson(id).subscribe(res => {
      console.log(res);
      this.person = res;
    });

    this.propertiesForm = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      registration_number: new FormControl(''),
      gender: new FormControl(''),
      civil_status: new FormControl(''),
      date_of_birth: new FormControl(''),
      date_of_death: new FormControl('')
    });
  }

}
