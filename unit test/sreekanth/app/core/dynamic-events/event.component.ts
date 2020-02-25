import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventComposerService } from './eventComposer.service';
import { Subject, takeUntil } from '@adapters/packageAdapter';

@Component({
    selector: 'ncp-event',
    template: ''
})

export class EventComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventArray = [];
    clickEvents = [];
    collapseEvents = [];
    expandEvents = [];
    modalOpenEvents = [];
    modalCloseEvents = [];
    tabChangeEvents = [];
    validateTabEvents = [];
    nextTabEvents = [];
    prevTabEvents = [];
    nextStepEvents = [];
    prevStepEvents = [];
    changeEvents = [];
    errorEvents = [];
    checkForNextStepEvents = [];
    pageScrolledEvents = [];
    subscriptionEvents = [];
    private ngUnsubscribe = new Subject();

    constructor(public eventHandler: EventService, public eventComposer: EventComposerService) { }

    ngOnInit() {
        this.eventHandler.clickSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.clickEvents.forEach(element => {  if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId'] ) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.collapseSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.collapseEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.expandSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.expandEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.modalOpenSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.modalOpenEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.modalCloseSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.modalCloseEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.tabChangeSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.tabChangeEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.validateTabSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.validateTabEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.nextTabSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.nextTabEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.prevTabSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.prevTabEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.nextStepSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.nextStepEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.prevStepSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.prevStepEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.changeSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.changeEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.errorSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.errorEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.checkForNextStepSub.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.checkForNextStepEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
        this.eventHandler.pageScrolled.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { if (data['id'].toLowerCase()) { this.pageScrolledEvents.forEach(element => { if (element['eventId'].toLowerCase() === data['id'].toLowerCase() || element['isRunWithOutId']) { this.eventComposer.createEventString(element, data); } }); } });
    }

    ngOnChanges(changes?: SimpleChanges) {
        if (changes['eventArray'] && this.eventArray && this.eventArray.length > 0) {
            this.resetDistributedEvents();
            // this.distributeEvents();
        }
    }

    distributeEvents() {
        this.eventArray.forEach(eventData => {
            if (eventData['triggerEvent']) {
                switch (eventData['triggerEvent']) {
                    case 'click':
                        this.clickEvents.push(eventData);
                        break;
                    case 'collapse':
                        this.collapseEvents.push(eventData);
                        break;
                    case 'expand':
                        this.expandEvents.push(eventData);
                        break;
                    case 'modalOpen':
                        this.modalOpenEvents.push(eventData);
                        break;
                    case 'modalClose':
                        this.modalCloseEvents.push(eventData);
                        break;
                    case 'tabChange':
                        this.tabChangeEvents.push(eventData);
                        break;
                    case 'validateTab':
                        this.validateTabEvents.push(eventData);
                        break;
                    case 'nextTab':
                        this.nextTabEvents.push(eventData);
                        break;
                    case 'prevTab':
                        this.prevTabEvents.push(eventData);
                        break;
                    case 'nextStep':
                        this.nextStepEvents.push(eventData);
                        break;
                    case 'prevStep':
                        this.prevStepEvents.push(eventData);
                        break;
                    case 'change':
                        this.changeEvents.push(eventData);
                        break;
                    case 'error':
                        this.errorEvents.push(eventData);
                        break;
                    case 'checkForNextStep':
                        this.checkForNextStepEvents.push(eventData);
                        break;
                    case 'pageScrolled':
                        this.pageScrolledEvents.push(eventData);
                        break;
                    default:
                        if (eventData['isCreateSubscribtion']) {
                            this.subscriptionEvents.push(eventData);
                        }
                }
            }
        });
    }

    resetDistributedEvents() {
        this.clickEvents = [];
        this.collapseEvents = [];
        this.expandEvents = [];
        this.modalOpenEvents = [];
        this.modalCloseEvents = [];
        this.tabChangeEvents = [];
        this.validateTabEvents = [];
        this.nextTabEvents = [];
        this.prevTabEvents = [];
        this.nextStepEvents = [];
        this.prevStepEvents = [];
        this.changeEvents = [];
        this.errorEvents = [];
        this.checkForNextStepEvents = [];
        this.pageScrolledEvents = [];
        this.subscriptionEvents = [];
    }

    ngOnDestroy() {
        this.eventComposer.subscribtionList.forEach(element => {
            element.unsubscribe();
        });
        this.resetDistributedEvents();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}