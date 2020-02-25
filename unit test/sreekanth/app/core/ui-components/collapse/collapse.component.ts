import { EventService } from '../../services/event.service';
import { UtilsService } from '../utils/utils.service';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit
} from '@angular/core';
@Component({

    selector: 'expand-collapse',
    templateUrl: './collapse.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class CollapseComponent implements OnInit, OnChanges {

    @Input() heading: string;
    @Input() indexes;
    @Input() parentIndex;
    @Input() superParentIndex;
    @Input() enableAddDelBtn: boolean = false;
    @Input() addDelId: boolean = false;
    @Input() displayValue1;
    @Input() displayValue2;
    @Input() alignment: string = 'left';
    @Input() downArrowFlag: boolean = true;
    @Input() separator: string = '';
    @Input() suffix: string = '';
    utils: UtilsService;
    eventHandler: EventService;
    @Input() collapseId: string;
    @Input() expandId: string;
    @Input() iconClass: string;
    @Input() firstIndexHeading;
    @Input() hasFirstIndexHeading: boolean = false;
    @Input() disableDelBtn: boolean = false;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() elementId: any = '';
    isExpanded: boolean = false;
    isCollapsed: boolean = true;
    isCollapse: boolean = false;
    isCollapsing: boolean = false;
    displayValues;
    @Input()
    public set collapse(value: boolean) {
        this.isExpanded = value;
        this.toggle();
    }
    public get collapse(): boolean {
        return this.isExpanded;
    }
    @Input()
    public set expand(value: boolean) {
        this.isExpanded = !value;
        this.toggle();
    }

    constructor(_utils: UtilsService, _eventHandler: EventService, public changeRef: ChangeDetectorRef) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
        this.isCollapsed = true;
        this.isExpanded = false;
        // this.heading = this.utils.getTranslated(this.heading);
    }


    ngOnInit() {
        this.downArrowFlag = this.downArrowFlag === undefined ? true : this.downArrowFlag;
    }

    ngOnChanges(changes?) {
        this.indexes = this.indexes ? this.indexes : '';
        this.displayValue1 = this.displayValue1 ? this.displayValue1 : '';
        this.displayValue2 = this.displayValue2 ? this.displayValue2 : '';
        this.separator = this.separator ? this.separator : '';
        this.suffix=this.suffix?this.suffix:'';
        if (!this.hasFirstIndexHeading) {
            this.displayValues = this.indexes
                + ' ' + this.separator
                + ' ' + this.displayValue1
                + ' ' + this.displayValue2
                + ' ' + this.suffix;
        } else {
            if (this.indexes) {
                if (this.indexes == 1) {
                    this.displayValues = this.separator
                        + ' ' + this.displayValue1
                        + ' ' + this.displayValue2
                        + ' ' + this.suffix;
                    this.heading = this.firstIndexHeading;
                } else {
                    this.displayValues = this.indexes - 1
                        + ' ' + this.separator
                        + ' ' + this.displayValue1
                        + ' ' + this.displayValue2
                        + ' ' + this.suffix;
                }
            }
        }
    }

    toggle() {
        if (this.isExpanded) {
            this.hide();
        } else {
            this.show();
        }
    }

    hide() {
        setTimeout(() => {
            this.isCollapse = true;
            this.isCollapsing = true;
            this.changeRef.markForCheck();
        }, 4);
        this.isExpanded = false;
        this.isCollapsed = true;
        this.eventHandler.setEvent('collapse', this.collapseId, this);
    }

    show() {
        setTimeout(() => {
            this.isCollapse = false;
            this.changeRef.markForCheck();
        }, 4);
        this.isCollapsing = false;
        this.isExpanded = true;
        this.isCollapsed = false;
        this.eventHandler.setEvent('expand', this.expandId, this);
    }

    add() {
        this.eventHandler.setEvent('click', this.addDelId, { 'type': 'add', 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
    }
    deleteCollapse() {
        this.eventHandler.setEvent('click', this.addDelId, { 'type': 'del', 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
    }
}

