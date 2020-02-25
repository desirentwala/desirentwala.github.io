import { CommonModule } from '@angular/common';
import { AfterContentInit, NgModule } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { ConfigService } from '../../services/config.service';
import { SharedModule } from '../../shared/shared.module';
import { UiDropdownModule } from '../dropdown';
import { ErrorModule } from '../error/error.component';
import { LabelModule } from '../label/label.component';
import { UiRadioModule } from '../radio';
import { UiTextBoxModule } from '../textbox';

@Component({
    selector: 'auto-renewal',
    templateUrl: './auto-renewal.html'
})

export class AutoRenewalComponent implements OnInit, AfterContentInit {
    @Input() renewalPlanControl: FormGroup;
    config: ConfigService;
    cardControl1 = new FormControl();
    cardControl2 = new FormControl();
    cardControl3 = new FormControl();
    cardControl4 = new FormControl();
    doHideCardDetails: boolean = false;
    cardNumberSeparator = '';
    isAutoRenewalApplicableRadioArray: any[] = [
        { label: 'Yes', value: 'Y' },
        { label: 'No', value: 'N' }
    ];
    instructionTypeRadioArray: any[] = [
        { label: 'Credit Card', value: 'CC' },
        { label: 'Easy Payment', value: 'EP' }
    ];
    typeOfCardRadioArray: any[] = [
        { label: 'VISA', value: 'VC' },
        { label: 'MASTER CARD', value: 'MC' }
    ];
    years: any[] = [];
    months: any[] = [];
    constructor(_config: ConfigService) {
        this.config = _config;

    }
    ngOnInit() {
        let date = new Date();
        let presentYear: number = date.getFullYear() + 1;
        let j = 0;
        for (let i = presentYear; i <= presentYear + 20; i++) {
            this.years[j] = i;
            j++;
        }
        for (let i = 1; i <= 12; i++) {
            this.months[i - 1] = i;
        }
    }
    ngAfterContentInit() {
        let editorMode = this.config.getCustom('editorMode') ? this.config.getCustom('editorMode') : false;
        if (editorMode) {
            this.renewalPlanControl.addControl('issuingBankCode', new FormControl(''));
            this.renewalPlanControl.addControl('cardType', new FormControl(''));
            this.renewalPlanControl.addControl('issuingBankName', new FormControl(''));
            this.renewalPlanControl.addControl('creditCardNo', new FormControl(''));
            this.renewalPlanControl.addControl('cardExpiryMonth', new FormControl(''));
            this.renewalPlanControl.addControl('cardExpiryYear', new FormControl(''));
            this.renewalPlanControl.addControl('isAutoRenewalApplicable', new FormControl(''));
        }
        this.renewalPlanControl.get('issuingBankCode').patchValue(null);
        this.renewalPlanControl.get('cardType').patchValue(null);
        this.renewalPlanControl.get('issuingBankName').patchValue(null);
        this.renewalPlanControl.get('creditCardNo').patchValue(null);
        this.renewalPlanControl.get('cardExpiryMonth').patchValue(null);
        this.renewalPlanControl.get('cardExpiryYear').patchValue(null);
        this.renewalPlanControl.get('isAutoRenewalApplicable').patchValue('N');
        this.doHideCardDetails = this.renewalPlanControl.status === "DISABLED";
        this.cardControl1.valueChanges.subscribe(data => {
            if (data.length >= 4) {
                document.getElementById('card2').focus();
                this.concat();
            }
        })

        this.cardControl2.valueChanges.subscribe(data => {
            if (data.length >= 4) {
                document.getElementById('card3').focus();
                this.concat();
            }
        })

        this.cardControl3.valueChanges.subscribe(data => {
            if (data.length >= 4) {
                document.getElementById('card4').focus();
                this.concat();
            }
        })

        this.cardControl4.valueChanges.subscribe(data => {
            this.concat();
        })
    }
    validateCreditCardNumber() {
        var ccNum: string = this.renewalPlanControl.get('creditCardNo').value.split(this.cardNumberSeparator).join('');
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;
        if (ccNum.match(visaRegEx)) {
            this.renewalPlanControl.get('cardType').patchValue('VC');
            isValid = true;
        } else if (ccNum.match(mastercardRegEx)) {
            this.renewalPlanControl.get('cardType').patchValue('MC');
            isValid = true;
        }
        if (!isValid) {
            this.renewalPlanControl.get('creditCardNo').setErrors({ 'customError': true });
        }
    }
    concat() {
        let value = '';
        if (this.cardControl1.value)
            value = this.cardControl1.value + this.cardNumberSeparator;
        if (this.cardControl2.value)
            value += this.cardControl2.value + this.cardNumberSeparator;
        if (this.cardControl3.value)
            value += this.cardControl4.value + this.cardNumberSeparator;
        if (this.cardControl4.value)
            value += this.cardControl4.value;
        if (value) {
            this.renewalPlanControl.get('creditCardNo').patchValue(value);
            this.renewalPlanControl.get('creditCardNo').updateValueAndValidity();
            this.validateCreditCardNumber();
        }
    }
}



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedModule, UiRadioModule, LabelModule, UiTextBoxModule, UiDropdownModule, ErrorModule],
    exports: [AutoRenewalComponent],
    declarations: [AutoRenewalComponent],
    providers: []
})
export class UiAutoRenewalModule { }
