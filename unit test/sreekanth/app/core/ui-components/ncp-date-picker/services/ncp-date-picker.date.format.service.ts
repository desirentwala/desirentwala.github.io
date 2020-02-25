import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../core/services/config.service';
@Injectable()
export class DateFormatService {
    config;
    constructor(_config: ConfigService) {
        this.config = _config;

    }
    formatDate(val: Date): string {
        let _dateFormat: string = this.config.get('dateFormat');
        _dateFormat = _dateFormat.toLowerCase();
        let day = ('0' + val.getDate()).slice(-2);
        let month = ('0' + (val.getMonth() + 1)).slice(-2);
        return _dateFormat.replace('yyyy', val.getFullYear().toString())
            .replace('mm', month)
            .replace('dd', day);
    }

    parseDate(val: String, srcFormat?: String) {
        let _dateFormat: String;
        let parsedDate: Date;
        if (srcFormat) {
            _dateFormat = srcFormat;
        } else {
            _dateFormat = this.config.get('dateFormat');
        }
        _dateFormat = _dateFormat.toLowerCase();
        let year = parseInt(val.substr(_dateFormat.indexOf('yyyy'), 4));
        let month = parseInt(val.substr(_dateFormat.indexOf('mm'), 2)) - 1;
        let day = parseInt(val.substr(_dateFormat.indexOf('dd'), 2));
        parsedDate = new Date(year, month, day);
        return parsedDate;
    }
}