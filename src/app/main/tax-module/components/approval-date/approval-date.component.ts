import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-approval-date',
  templateUrl: './approval-date.component.html',
  styleUrls: ['./approval-date.component.scss']
})
export class ApprovalDateComponent implements OnInit {

  isVisible = false;

  @Input()
  approvalDate;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    if (!this.approvalDate) {
      this.approvalDate = new Date();
    }
  }

  @Output()
  onCancel = new EventEmitter();

  @Output()
  onConfirm = new EventEmitter();

  ngOnInit() {}

  closeModal(save) {

    if (!save) {
      this.onCancel.emit();
      this.isVisible = false;
      return;
    }

    this.onConfirm.emit(this.approvalDate);
    this.isVisible = false;
  }

}
