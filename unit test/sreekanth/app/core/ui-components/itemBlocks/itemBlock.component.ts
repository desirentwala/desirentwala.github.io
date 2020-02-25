import { UiAmountModule } from '../amount';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../services/config.service';
import { SliderModule } from '../slider';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';


@Component({
    selector: 'item-block',
    templateUrl: 'itemBlock.component.html'
})

export class ItemBlockComponent implements OnInit, AfterViewInit {
    @Input() labelControl: FormControl;
    @Input() premiumBlock: boolean = false;
    @Input() premiumLabel: string = '';
    @Input() amountControl: FormControl;
    @Input() isDisabled: boolean = false;
    @Input() productCode: string = '';
    @Input() hasSlider: boolean = false;
    @Input() showDelBtn: boolean = false;
    @Input() clickId: string;
    @Input() indexes;
    @Input() parentIndex;
    @Input() superParentIndex;
    config: ConfigService;
    eventHandler: EventService;
    formattedAmount: string = '';
    inputFlag: boolean = false;
    sliderClass: string = 'col-md-6 col-sm-12 col-xs-12 mt7 ml-md-15 pull-left mt-sm-25 mb-sm-10 ml-sm-0 ml-xs-0 pl-sm-0 mt-xs-25 pl-xs-0 mb-xs-10';
    constructor(public amtFormat: AmountFormat, _eventHandler: EventService) {
        this.eventHandler = _eventHandler;
    }



    ngOnInit() { }
    ngDoCheck() {
        if (this.amountControl && this.amountControl.value && !this.formattedAmount) {
            if (!this.inputFlag)
                this.formatAmount(this.amountControl.value);
        }
    }
    ngAfterViewInit() {
        this.amountControl.valueChanges.subscribe((value) => {
            if (value) {
                if (isNaN(value)) {
                    value = parseFloat(value);
                }
                if (!this.inputFlag) {
                    this.formatAmount(value);
                }
            }
        });


    }

    formatAmount(event: any, e?) {
        let value;
        value = event instanceof Object ? event.target.value : event;
        if (value === '') {
            this.formattedAmount = this.amtFormat.transform('0', []);
            //this.formattedAmount =  this.formattedAmount.slice(0,this.formattedAmount.length-3);
            this.amountControl.setValue('0.00');
        }
        if (value !== '') {
        this.formattedAmount = this.amtFormat.transform(value, []);
            //this.formattedAmount =  this.formattedAmount.slice(0,this.formattedAmount.length-3);
            if (e === 'input') {
                this.amountControl.setValue(value);
            }
        }

    }
    getActualValue() {
        if (!isNaN(this.amountControl.value)) {
            if (this.amountControl.value === "0.00" || this.amountControl.value === "0") {
                this.formattedAmount = '';
                this.amountControl.setValue('');
            } else {
                this.formattedAmount = this.amountControl.value;
            }
        }

    }

     //Function to allow only one Decimal place to textbox
    validateDec(key) {
        var keycode = (key.which) ? key.which : key.keyCode;
        if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
            return false;
        }
        else {
            var parts = key.srcElement.value.split('.');
            if (parts.length > 1 && keycode == 46)
                return false;
            return true;
        }
    }

    deleteItem() {
        this.eventHandler.setEvent('click', this.clickId, { 'index': this.indexes, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
    }

}



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, UiAmountModule, SliderModule, SharedModule],
    exports: [ItemBlockComponent],
    declarations: [ItemBlockComponent],
    providers: [AmountFormat]
})
export class ItemBlocksModule { }
