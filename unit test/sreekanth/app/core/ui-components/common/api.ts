import {EventEmitter,Injectable} from '@angular/core';
import {Subject, Observable} from '@adapters/packageAdapter';

export {DomHandler} from '../dom/domhandler';

export interface SortMeta {
    field: string;
    order: number;
}

export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {[s: string]: FilterMetadata;};
}

export interface FilterMetadata {
    value?: any;
    matchMode?: string;
}

export interface MenuItem {
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    eventEmitter?: EventEmitter<any>;
    items?: MenuItem[];
    expanded?: boolean;
    disabled?: boolean;
}

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
}

export interface SelectItem {
    label: string;
    value: any;
}

export interface TreeNode {
    label?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    elementList?: any[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: any;
    partialSelected?: boolean;
}

export interface Confirmation {
    message: string;
    icon?: string;
    header?: string;
    accept?: Function;
    reject?: Function;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    acceptEvent?: EventEmitter<any>;
    rejectEvent?: EventEmitter<any>;
}

export interface BlockableUI {
    getBlockableElement(): HTMLElement;
}

export interface SelectButtonWithTexts {
    label: string;
    value: any;
    optionalText1: string;
    optionalText2: string;
    optionalText3: string;
    imageURL: string;
}

export interface ValidationHandler {
    required: boolean;
    requiredTrue: boolean;
    nullValidator: boolean;
    minlength: number;
    validateDate: boolean;
    minAge: number;
    maxAge: number;
    maxNumber: number;
    minNumber: number;
    mailFormat: boolean;
    multiplemailFormat: boolean;
    pattern: string;
    maxSize: number;
    minSize:number;
}

@Injectable()
export class ConfirmationService {

    public requireConfirmationSource = new Subject<Confirmation>();
    public acceptConfirmationSource = new Subject<Confirmation>();

    requireConfirmation$ = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();

    confirm(confirmation: Confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }

    onAccept() {
        this.acceptConfirmationSource.next();
    }
}