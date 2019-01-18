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
  countries = [];

  @Input()
  set visible (visible: boolean) {
    this.isVisible = visible;
    if (visible === true) {
      this.setForm();
    }
  }

  @Output()
  cancel  = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  form: FormGroup;
  isVisible = false;

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

    const value          = this.form.value;
    const isAddressExist = Object.keys(value).some(key => value[key]);
    const address        = isAddressExist ? { country: value.country, lines: [value.firstLine, value.secondLine, value.thirdLine] }
                                          : null;
    this.isVisible = false;
    save ? this.confirm.emit(address) : this.cancel.emit();
  }
}
