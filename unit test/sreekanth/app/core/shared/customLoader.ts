
import {forkJoin as observableForkJoin} from '@adapters/packageAdapter';

import {catchError, map} from '@adapters/packageAdapter';
import { HttpClient } from '@adapters/packageAdapter';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@adapters/packageAdapter';
import { Observable } from '@adapters/packageAdapter';

import { environment } from '../../../environments/environment';

@Injectable()
export class CustomLoader implements TranslateLoader {
    public resources: { prefix: string, suffix: string }[] = [
        { prefix: './assets/i18n/ncp_', suffix: '.json' },
    ];
    constructor(public http: HttpClient) {
        let appType: string = environment.applicationType || 'ncp';
        if (environment.applicationType) {
            let projectResource: any = { prefix: './assets/i18n/' + appType + '_', suffix: '.json' };
            this.resources.push(projectResource);
        }
       if (environment.country !== '') {
            let countryResource: any = { prefix: './assets/i18n/' + appType + environment.country + '_', suffix: '.json' };
            this.resources.push(countryResource);
        }

        if (environment.project !== '') {
            let projectResource: any = { prefix: './assets/i18n/' + appType + environment.project + '_', suffix: '.json' };
            this.resources.push(projectResource);
        }
    }
    public getTranslation(lang: any): any {
        try {
            let errors: any = 'Error';
            return observableForkJoin(this.resources.map(config => {
                return this.http.get(`${config.prefix}${lang}${config.suffix}`).pipe(catchError((error: any) => {
                    if (error.status === 404) {
                        errors = lang + 'file is not found';
                        return errors;
                    }
                }));
            })).pipe(map(response => {
                let resultObj: any = {};
                if (response) {
                    let responseLength = response.length;
                    let targetObj: any = {};
                    let sourceObj: any = {};
                    let responseReverse = response.reverse();
                    for (let i = 0; i < responseLength; i++) {
                        if (responseReverse[i]) {
                            targetObj = responseReverse[i];
                            resultObj = Object.assign(targetObj, sourceObj);
                            sourceObj = targetObj;
                        }
                    }
                }
                return resultObj;
            }));
        } catch (e) {
            // console.log('TranslateService Exception');
        }
    }
}
