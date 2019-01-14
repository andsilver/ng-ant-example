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
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal(save) {

    if (!save) {
      this.onCancel.emit();
      this.isVisible = false;
      return;
    }

    this.onConfirm.emit(this.specification);
    this.isVisible = false;
  }

}
