import { SharedModule } from '../../shared/shared.module';
import { Modal } from './Modal';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { UiButtonModule } from '../button/index';
import { UiMiscModule } from '../misc-element/misc.component';

export * from './Modal';

@Component({
    selector: 'modal-header',
    template: `<ng-content></ng-content>`
})
export class ModalHeader {

}

@Component({
    selector: 'modal-content',
    template: `<ng-content></ng-content>`
})
export class ModalContent {

}

@Component({
    selector: 'modal-footer',
    template: `<ng-content></ng-content>`
})
export class ModalFooter {

}

@NgModule({
    imports: [
        CommonModule,SharedModule, UiButtonModule, UiMiscModule
    ],
    declarations: [
        Modal,
        ModalHeader,
        ModalContent,
        ModalFooter
    ],
    exports: [
        Modal,
        ModalHeader,
        ModalContent,
        ModalFooter
    ]
})
export class ModalModule {

}