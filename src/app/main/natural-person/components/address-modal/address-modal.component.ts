import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss']
})
export class AddressModalComponent implements OnInit {

  @Input()
  address: any;

  @Input()
  set visible (visible: boolean) {
    this.isVisible = visible;
    if (visible === true) {
      this.setForm();
    }
  }

  @Output()
  onCancel  = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  form: FormGroup;
  isVisible = false;
  countries = ['FR', 'BE', 'UK'];
  
  constructor() { }

  ngOnInit() {
  }

  setForm() {
    this.form = new FormGroup({
      country   : new FormControl(this.address && this.address['country'] ? this.address['country'] : ''),
      firstLine : new FormControl(this.address && this.address['lines'] && this.address['lines'][0] ? this.address['lines'][0] : '' ),
      secondLine: new FormControl(this.address && this.address['lines'] && this.address['lines'][1] ? this.address['lines'][1] : '' ),
      thirdLine : new FormControl(this.address && this.address['lines'] && this.address['lines'][2] ? this.address['lines'][2] : '' )
    });
  }

  closeModal(save) {

    const value = this.form.value;
    let isAddressExist = false;
    Object.keys(value).forEach(key => {
      if (value[key]) {
        isAddressExist = true;
      }
    });

    const address = isAddressExist ? {
      country: value.country,
      lines  : [value.firstLine, value.secondLine, value.thirdLine]
    } : null;

    this.isVisible = false;
    save ? this.onConfirm.emit(address) : this.onCancel.emit()
  }
}
