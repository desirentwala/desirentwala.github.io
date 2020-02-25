import { animate, style, transition, trigger } from '@adapters/packageAdapter';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { UtilsService } from '../utils/utils.service';


@Component({

    selector: 'ncp-modal',
    templateUrl: './modal.html',
    animations: [
        trigger('modalAnim', [
            transition(':enter', [
                style({ transform: 'translate3d(0, -100%, 0) rotateY(90deg)', height: '100%' }),
                animate('0.55s 0.2s ease-in-out')
            ])
        ])
    ]
})
export class Modal implements OnInit, OnChanges {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    modalClass: string;

    @Input()
    closeOnEscape: boolean = true;

    @Input()
    closeOnOutsideClick: boolean = true;

    @Input()
    modalTitle: string;

    @Input()
    titleIcon: string;

    @Input()
    hideCloseButton = false;

    @Input()
    cancelButtonLabel: string;

    @Input()
    submitButtonLabel: string;

    @Input()
    modalKey: boolean = false;
    @Input()
    overFlowXFlag: boolean = false;

    @Input()
    overFlowYFlag: boolean = false;
    
    @Input()
    isPreviewModal: boolean = false;
    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    @Input()
    modalOnOpenId: string;

    @Input()
    modalOnCloseId: string;


    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    isOpened = false;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    @ViewChild('modalRoot')
    public modalRoot: ElementRef;


    public backdropElement: HTMLElement;
    utils: UtilsService;
    eventHandler: EventService;
    editorMode: boolean = false;
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(_utils: UtilsService, _eventHandler: EventService, public config?: ConfigService) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
        this.createBackDrop();

    }

    // -------------------------------------------------------------------------
    // OnInit Methods
    // -------------------------------------------------------------------------
    ngOnInit() {

        this.cancelButtonLabel = this.utils.getTranslated(this.cancelButtonLabel);
        this.submitButtonLabel = this.utils.getTranslated(this.submitButtonLabel);

    }
    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------

    ngOnChanges(changes?) {
        if (this.modalKey) {
            this.open();
        } else {
            this.close();
        }
    }

    ngOnDestroy() {
        if ( !this.editorMode || this.isPreviewModal) {
            document.body.className = document.body.className.replace(/modal-open\b/, '');
            if (this.backdropElement && this.backdropElement.parentNode === document.body)
                document.body.removeChild(this.backdropElement);
        }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    open(...args: any[]) {
        if (this.isOpened)
            return;

        this.isOpened = true;
        this.editorMode = this.config.getCustom('editorMode') ? this.config.getCustom('editorMode') : false;
        if ( !this.editorMode || this.isPreviewModal) {
            this.eventHandler.setEvent('modalOpen', this.modalOnOpenId, args);
            document.body.appendChild(this.backdropElement);
            window.setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
            document.body.className += ' modal-open';
        }
    }

    close(...args: any[]) {
        if (!this.isOpened)
            return;

        this.isOpened = false;
        if ( !this.editorMode || this.isPreviewModal) {
            this.eventHandler.setEvent('modalClose', this.modalOnCloseId, args);
            document.body.removeChild(this.backdropElement);
            document.body.className = document.body.className.replace(/modal-open\b/, '');
        }
    }


    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    public preventClosing(event: MouseEvent) {
        event.stopPropagation();
    }

    public createBackDrop() {

        this.backdropElement = document.createElement('div');
        this.backdropElement.classList.add('modal-backdrop');
        this.backdropElement.classList.add('fade');
        this.backdropElement.classList.add('in');
    }

}
