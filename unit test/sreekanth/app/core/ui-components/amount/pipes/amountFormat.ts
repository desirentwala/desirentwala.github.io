import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Pipe({
    name: 'amountFormat',
    pure: true
})

export class AmountFormat implements PipeTransform {
    config;
    constructor(config: ConfigService) {
        this.config = config;
    }
    transform(value: any, args: any[]) {
        let digits;
        let currencyCode;
        let symbolDisplay;
        let user_currency_code = this.config.getCustom('currency_code');
        //let userLang = this.config.getCustom('user_lang');
        //let locale = userLang ? userLang : window.navigator.language;
        if (value !== '' && value !== null && value !== undefined) {
            digits = args.length > 0 && args[0] !== undefined && args[0] !== null && args[0] !== '' ? args[0] : this.config.get('digit');
            currencyCode = args.length > 2 && args[2] !== undefined && args[2] !== null && args[2] !== '' ? args[2] : (user_currency_code ? user_currency_code : this.config.get('currencyCode'));
            symbolDisplay = args.length > 1 && args[1] !== undefined && args[1] !== null && args[1] !== '' ? args[1] : this.config.get('symbolDisplay');
            return this.myTransform(value, currencyCode, symbolDisplay, digits);
        }
    }
    public myTransform(num: any, currencyCode: string, showSymbol: boolean, digits: string): any {
        let display = showSymbol ? 'symbol' : 'code';
        let userLang = this.config.getCustom('user_lang');
        let locale = window.navigator.language;
        let value = new CurrencyPipe(locale).transform(num, currencyCode, display, digits);
        let firstDigit = value.match(/\d/);
        let symbol = firstDigit.index ? value.slice(0, firstDigit.index) : '';
        let amount = firstDigit.index ? value.slice(firstDigit.index) : '';
        if (this.config.get('removeFloatForAmount') && amount.indexOf('.') != -1) {
            amount = amount.substr(0, amount.indexOf('.'));
        }
        return symbol + ' ' + amount;
    }
}
