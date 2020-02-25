import { Injectable } from '@angular/core';
import { IMyLocales, IMyOptions } from '../interfaces/index';

@Injectable()
export class LocaleService {
    public locales: IMyLocales = {
        'en': {
            dayLabels: { su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'T', fr: 'F', sa: 'S' },
            monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' },
            datesLabels: {
                0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15',
                16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28', 29: '29', 30: '30', 31: '31'
            },
            dateFormat: 'yyyy-mm-dd',
            todayBtnTxt: 'Today',
            firstDayOfWeek: 'mo',
            sunHighlight: true
        },
        'ja': {
            dayLabels: { su: '日', mo: '月', tu: '火', we: '水', th: '木', fr: '金', sa: '土' },
            monthLabels: { 1: '１月', 2: '２月', 3: '３月', 4: '４月', 5: '５月', 6: '６月', 7: '７月', 8: '８月', 9: '９月', 10: '１０月', 11: '１１月', 12: '１２月' },
            datesLabels: {
                0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五',
                16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '二十一', 22: '二十二', 23: '二十三', 24: '二十四', 25: '二十五', 26: '二十六', 27: '二十七', 28: '二十八', 29: '二十九', 30: '三十', 31: '三十一'
            },
            dateFormat: 'yyyy.mm.dd',
            todayBtnTxt: '今',
            firstDayOfWeek: 'mo',
            sunHighlight: false
        },
        'fr': {
            dayLabels: { su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam' },
            monthLabels: { 1: 'Jan', 2: 'Fév', 3: 'Mar', 4: 'Avr', 5: 'Mai', 6: 'Juin', 7: 'Juil', 8: 'Aoû', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Déc' },
            datesLabels: {
                0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五',
                16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '二十一', 22: '二十二', 23: '二十三', 24: '二十四', 25: '二十五', 26: '二十六', 27: '二十七', 28: '二十八', 29: '二十九', 30: '三十', 31: '三十一'
            },
            dateFormat: 'dd/mm/yyyy',
            todayBtnTxt: 'Aujourd\'hui',
            firstDayOfWeek: 'mo',
            sunHighlight: true
        },
        'fi': {
            dayLabels: { su: 'Su', mo: 'Ma', tu: 'Ti', we: 'Ke', th: 'To', fr: 'Pe', sa: 'La' },
            monthLabels: { 1: 'Tam', 2: 'Hel', 3: 'Maa', 4: 'Huh', 5: 'Tou', 6: 'Kes', 7: 'Hei', 8: 'Elo', 9: 'Syy', 10: 'Lok', 11: 'Mar', 12: 'Jou' },
            datesLabels: {
                0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五',
                16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '二十一', 22: '二十二', 23: '二十三', 24: '二十四', 25: '二十五', 26: '二十六', 27: '二十七', 28: '二十八', 29: '二十九', 30: '三十', 31: '三十一'
            },
            dateFormat: 'dd.mm.yyyy',
            todayBtnTxt: 'Tämä päivä',
            firstDayOfWeek: 'mo',
            sunHighlight: true
        },
        'es': {
            dayLabels: { su: 'Do', mo: 'Lu', tu: 'Ma', we: 'Mi', th: 'Ju', fr: 'Vi', sa: 'Sa' },
            monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
            datesLabels: {
                0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五',
                16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '二十一', 22: '二十二', 23: '二十三', 24: '二十四', 25: '二十五', 26: '二十六', 27: '二十七', 28: '二十八', 29: '二十九', 30: '三十', 31: '三十一'
            },
            dateFormat: 'dd.mm.yyyy',
            todayBtnTxt: 'Hoy',
            firstDayOfWeek: 'mo',
            sunHighlight: true
        },
        'fa':{
            dayLabels: { su: 'ش' ,mo: 'د', tu: 'س',we: 'چ',  th: 'پ', fr: 'ج',  sa: 'ی' },
            monthLabels: { 1: 'ارد', 2: 'فرو', 3: 'اسف', 4: 'بهم', 5: 'دی', 6: 'آذر', 7: 'آبا', 8: 'مهر', 9: 'شهر', 10: 'مرد', 11: 'تیر', 12: 'خرد' },
            datesLabels: {
                0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹', 10: '۱۰', 11: '۱۱', 12: '۱۲', 13: '۱۳', 14: '۱۴', 15: '۱۵',
                16: '۱۶', 17: '۱۷', 18: '۱۸', 19: '۱۹', 20: '۲۰', 21: '۲۱', 22: '۲۲', 23: '۲۳', 24: '۲۴', 25: '۲۵', 26: '۲۶', 27: '۲۷', 28: '۲۸', 29: '۲۹', 30: '۳۰', 31: '۳۱'
            },
            dateFormat: 'yyyy-mm-dd',
            todayBtnTxt: 'امروز',
            firstDayOfWeek: 'fr',
            sunHighlight: false
        }
    };

    getLocaleOptions(locale: string): IMyOptions {
        if (locale && this.locales.hasOwnProperty(locale)) {
            // User given locale
            return this.locales[locale];
        }
        // Default: en
        return this.locales['en'];
    }
}
