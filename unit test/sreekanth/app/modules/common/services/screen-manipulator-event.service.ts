import { Injectable } from '@angular/core';
import { Subject } from '@adapters/packageAdapter';

@Injectable()
export class ScreenManipulatorEvent {

    public notifierSub = new Subject();

    setEvent(value) {
        this.notifierSub.next({ value: value });
    }

}