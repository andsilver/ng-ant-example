import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-approval-date',
  templateUrl: './approval-date.component.html',
  styleUrls: ['./approval-date.component.scss']
})
export class ApprovalDateComponent implements OnInit {

  isVisible = false;
  title: string;

  @Input()
  approvalDate;

  @Input()
  set visible(visible: boolean) {
    this.isVisible = visible;
    if (!this.approvalDate) {
      this.title = 'Approve';
    } else {
      this.title = 'Edit Approval Date';
    }
  }

  @Output()
  cancel = new EventEmitter();

  @Output()
  confirm = new EventEmitter();

  ngOnInit() {}

  closeModal(save) {

    if (!save) {
      this.cancel.emit();
      this.isVisible = false;
      return;
    }

    this.confirm.emit(this.approvalDate);
    this.isVisible = false;
  }

}
