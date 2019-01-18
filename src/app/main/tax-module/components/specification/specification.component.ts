import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit {

  isVisible = false;

  @Input()
  specification: string;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
  }

  @Output()
  cancel = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal(save) {

    if (!save) {
      this.cancel.emit();
      this.isVisible = false;
      return;
    }

    this.confirm.emit(this.specification);
    this.isVisible = false;
  }

}
