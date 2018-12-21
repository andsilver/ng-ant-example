import { Input, Output, EventEmitter } from '@angular/core';

export class Modal {

    data: any;

    @Input()
    set visible(visible: boolean) {
        this.setData();
    }

    @Output()
    onClose = new EventEmitter();

    @Output()
    onConfirm = new EventEmitter();

    closeModal(save) {
        this.visible = false;
        save ? this.onConfirm.emit(this.data) : this.onClose.emit()
    }

    setData() {

    }
}
