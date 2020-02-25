import {NgModule, Component, ElementRef, AfterViewInit, AfterViewChecked, OnChanges, Input, forwardRef, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {DomHandler} from '../dom/domhandler';

export const INPUTSWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputSwitch),
    multi: true
};

@Component({
    
    selector: 'ncp-inputSwitch',
    templateUrl: './inputswitch.html',
    providers: [INPUTSWITCH_VALUE_ACCESSOR, DomHandler]
})
export class InputSwitch implements ControlValueAccessor, AfterViewInit, AfterViewChecked {

    @Input() onLabel: string = 'On';

    @Input() offLabel: string = 'Off';

    @Input() disabled: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    checked: boolean = false;

    focused: boolean = false;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    protected container: any;

    protected handle: any;

    protected onContainer: any;

    protected offContainer: any;

    protected onLabelChild: any;

    protected offLabelChild: any;

    protected offset: any;

    initialized: boolean = false;

    constructor(protected el: ElementRef, protected domHandler: DomHandler) { }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];
        this.handle = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-inputswitch-handle');
        this.onContainer = this.domHandler.findSingle(this.container, 'div.ui-inputswitch-on');
        this.offContainer = this.domHandler.findSingle(this.container, 'div.ui-inputswitch-off');
        this.onLabelChild = this.domHandler.findSingle(this.onContainer, 'span.ui-inputswitch-onlabel');
        this.offLabelChild = this.domHandler.findSingle(this.offContainer, 'span.ui-inputswitch-offlabel');
    }

    ngAfterViewChecked() {
        if (this.container.offsetParent && !this.initialized) {
        //    this.render();
        }
    }

    render() {
        let onContainerWidth = this.domHandler.width(this.onContainer),
            offContainerWidth = this.domHandler.width(this.offContainer),
            spanPadding = this.domHandler.innerWidth(this.offLabelChild) - this.domHandler.width(this.offLabelChild),
            handleMargins = this.domHandler.getOuterWidth(this.handle) - this.domHandler.innerWidth(this.handle);

        var containerWidth = (onContainerWidth > offContainerWidth) ? onContainerWidth : offContainerWidth,
            handleWidth = containerWidth;

        this.handle.style.width = handleWidth + 'px';
        handleWidth = this.domHandler.width(this.handle);
        containerWidth = containerWidth + handleWidth + 6;

        var labelWidth = containerWidth - handleWidth - spanPadding - handleMargins;

        this.container.style.width = containerWidth + 'px';
        this.onLabelChild.style.width = labelWidth + 'px';
        this.offLabelChild.style.width = labelWidth + 'px';

        //position
        this.offContainer.style.width = (this.domHandler.width(this.container) - 5) + 'px';
        this.offset = this.domHandler.width(this.container) - this.domHandler.getOuterWidth(this.handle);

        //default value
        if (this.checked) {
            this.handle.style.left = this.offset + 'px';
            this.onContainer.style.width = this.offset + 'px';
            this.offLabelChild.style.marginRight = -this.offset + 'px';
        } else {
            this.onContainer.style.width = 0 + 'px';
            this.onLabelChild.style.marginLeft = -this.offset + 'px';
        }

        this.initialized = true;
    }

    toggle(event, checkbox) {
        if (!this.disabled) {
            if (this.checked) {
                this.checked = false;
                this.uncheckUI();
            } else {
                this.checked = true;
                this.checkUI();
            }

            this.onModelChange(this.checked);
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            checkbox.focus();
        }
    }

    checkUI() {
        this.onContainer.style.width = this.offset + 'px';
        this.onLabelChild.style.marginLeft = 0 + 'px';
        this.offLabelChild.style.marginRight = -this.offset + 'px';
        this.handle.style.left = this.offset + 'px';
    }

    uncheckUI() {
        this.onContainer.style.width = 0 + 'px';
        this.onLabelChild.style.marginLeft = -this.offset + 'px';
        this.offLabelChild.style.marginRight = 0 + 'px';
        this.handle.style.left = 0 + 'px';
    }

    onFocus(event) {
        this.focused = true;
    }

    onBlur(event) {
        this.focused = false;
        this.onModelTouched();
    }

    writeValue(checked: any): void {
        this.checked = checked;

        if (this.initialized) {
            if (this.checked === true) {
               // this.checkUI();
            } 
              //  this.uncheckUI();
        }
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [InputSwitch],
    declarations: [InputSwitch]
})
export class InputSwitchModule { }