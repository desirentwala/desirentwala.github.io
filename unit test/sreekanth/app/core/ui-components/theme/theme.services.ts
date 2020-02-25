import { ConfigService } from '../../services/config.service';
import { Injectable } from '@angular/core';
import { Subject } from '@adapters/packageAdapter';
import { catchError } from '@adapters/packageAdapter';

@Injectable()
export class ThemeService {
    public themeList: any;
    public ncpThemeServicesSub = new Subject();
    constructor(public config: ConfigService) {
        this.config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
                let responseList = this.config.ncpJsonCall('assets/config/theme.json').pipe(catchError((error: any) => {
                    if (error.status === 404) {
                        let errors = 'file is not found';
                        return errors;
                    }
                }));
                responseList.subscribe((responseData) => {
                    this.themeList = responseData;
                });
            }
        });
    }

getThemeName(themeName, isb2b2c?,isb2c?) {
    let themeFullName = '';
    this.themeList.themes.forEach(element => {
        if (isb2b2c) {
            if (element.indexOf(themeName) !== -1 && element.indexOf('b2bc') !== -1) {
                themeFullName = element;
            }
        } else if (isb2c) {
            if (element.indexOf(themeName) !== -1 && element.indexOf('b2c') !== -1) {
                themeFullName = element;
            }
        } else {
            if (element.indexOf(themeName) !== -1) {
                themeFullName = element;
            }
        }
    });
    return themeFullName;
}
    isRTLLocal(localCode) {
        let isRTL: boolean = false;
        let localList = this.config._config['rtlLocals'];
        localList.forEach(element => {
            if (element === localCode)
                isRTL = true;
        });
        return isRTL;
    }
    getLocalThemeName(localCode) {
        if (this.isRTLLocal(localCode)) {
            return this.getThemeName('rtlTheme');
        } else {
            return null;
        }
    }
}
