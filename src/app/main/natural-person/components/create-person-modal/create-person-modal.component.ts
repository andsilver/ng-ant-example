import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-person-modal',
  templateUrl: './create-person-modal.component.html',
  styleUrls: ['./create-person-modal.component.scss']
})
export class CreatePersonModalComponent implements OnInit {

  isVisible = false;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    if (visible == true) {
      this.propertiesForm.reset();
      this.addressForms.forEach(f => f.form.reset());
    }
  }

  @Output()
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  propertiesForm   : FormGroup;

  addressForms             = [];
  submitted                = false;
  addResidentialAddress    = false;
  addCorrespondenceAddress = false;
  genders                  = ['MALE', 'FEMALE', 'UNKNOWN'];
  civilStatuses            = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
  countries                = ['FR', 'BE', 'UK'];

  constructor() { }

  ngOnInit() {
    this.propertiesForm = new FormGroup({
      lastName             : new FormControl('', [Validators.required]),
      firstName            : new FormControl('', [Validators.required]),
      registrationNumber   : new FormControl(''),
      gender               : new FormControl('', [Validators.required]),
      civilStatus          : new FormControl('', [Validators.required]),
      dateOfBirth          : new FormControl(''),
      dateOfDeath          : new FormControl(''),
    });

    const address = new FormGroup({
      country              : new FormControl(''),
      firstLine            : new FormControl(''),
      secondLine           : new FormControl(''),
      thirdLine            : new FormControl('')
    });

    this.addressForms = [{
      title: 'Residential Address',
      form : address
    }, {
      title: 'Correspondence Address',
      form : address
    }];
  }

  closeModal(save) {

    this.submitted = true;

    if (!this.propertiesForm.valid && save) {
      for (const i in this.propertiesForm.controls) {
        this.propertiesForm.controls[ i ].markAsDirty();
        this.propertiesForm.controls[ i ].updateValueAndValidity();
      }
      return;
    }

    if (save) {
      const person = this.propertiesForm.value;

      for (const f of this.addressForms) {
        const address = f.form.value;
        let exist = false;
        Object.keys(address).forEach(key => {
          if (address[key]) {
            exist = true;
          }
        });

        const value = exist ? {
          country: address.country,
          lines  : [address.firstLine, address.secondLine, address.thirdLine]
        } : null;

        f.title === 'Residential Address' ? person['residentialAddress'] = value : person['correspondenceAddress'] = value;
      }

      this.onConfirm.emit(person);
    } else {
      this.onCancel.emit();
    }

    this.isVisible = false;
  }

}
