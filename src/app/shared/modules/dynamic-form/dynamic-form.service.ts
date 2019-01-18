import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DynamicFormService {

    instances = [];

    getValue = new Subject();
    getValidation = new Subject();

    getValueEvent = new Subject();
    submitEvent = new Subject();

    async value() {
        this.getValueEvent.next();
        const value = await this.getValue;
        return value;
    }

    async submit() {
        this.submitEvent.next();
        const valid = await this.getValidation;
        if (!valid) {
            return false;
        }
        const value = await this.value;
        return value;
    }
}
