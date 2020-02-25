import { Injectable } from '@angular/core';
import { Subject } from '@adapters/packageAdapter';
import { environment } from '../../../environments/environment';

@Injectable()
export class EventService {

    public clickSub = new Subject<{ value: any, id: string }>();
    public collapseSub = new Subject<{ value: any, id: string }>();
    public expandSub = new Subject<{ value: any, id: string }>();
    public modalOpenSub = new Subject<{ value: any, id: string }>();
    public modalCloseSub = new Subject<{ value: any, id: string }>();
    public tabChangeSub = new Subject<{ value: any, id: string }>();
    public validateTabSub = new Subject<{ value: any, id: string }>();
    public nextTabSub = new Subject<{ value: any, id: string }>();
    public prevTabSub = new Subject<{ value: any, id: string }>();
    public nextStepSub = new Subject<{ value: any, id: string }>();
    public prevStepSub = new Subject<{ value: any, id: string }>();
    public changeSub = new Subject<{ value: any, id: string }>();
    public errorSub = new Subject<{ value: any, id: string }>();
    public checkForNextStepSub = new Subject<{ value: any, id: string }>();
    public pageScrolled = new Subject();
    public dataShare = new Subject<{ value: any, id: string }>();

    setEvent(type, id, value?) {
        if (type === 'click') {
            this.clickSub.next({ value: value, id: id });
        } else if (type === 'collapse') {
            this.collapseSub.next({ value: value, id: id });
        } else if (type === 'expand') {
            this.expandSub.next({ value: value, id: id });
        } else if (type === 'modalOpen') {
            this.modalOpenSub.next({ value: value, id: id });
        } else if (type === 'modalClose') {
            this.modalCloseSub.next({ value: value, id: id });
        } else if (type === 'onTabChange') {
            this.tabChangeSub.next({ value: value, id: id });
        } else if (type === 'onValidateTab') {
            this.validateTabSub.next({ value: value, id: id });
        } else if (type === 'onNext') {
            this.nextTabSub.next({ value: value, id: id });
        } else if (type === 'onPrevious') {
            this.prevTabSub.next({ value: value, id: id });
        } else if (type === 'onNextStep') {
            this.nextStepSub.next({ value: value, id: id });
        } else if (type === 'onPreviousStep') {
            this.prevStepSub.next({ value: value, id: id });
        } else if (type === 'change') {
            this.changeSub.next({ value: value, id: id });
        } else if (type === 'error') {
            this.errorSub.next({ value: value, id: id });
        } else if (type === 'onDoCheckForNext') {
            this.checkForNextStepSub.next({ value: value, id: id });
        }
    }


}