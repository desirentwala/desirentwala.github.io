import { FormControl } from '@angular/forms';


export class EmailIdvalidators {

    static mailFormat(control: FormControl):ValidationResult {


        var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (control.value != '' && control.value != null && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { 'mailFormat': true };
        }

        return null;

    };
    static multiplemailFormat(separator?: any) {
        return (control: FormControl) => {
            let emails: any[] = [];
            let trueFlag: boolean = false;
            var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (control.value != '' && control.value != null) {
                emails = (control.value).split(separator ? separator : ";");
            }
            for (let i = 0; i < emails.length; i++) {
                if ((!EMAIL_REGEXP.test(emails[i]) || emails[i].length <= 5) && emails[i] != '' && emails[i] != null) {
                    trueFlag = true;
                }
            }
            if (trueFlag) {
                return { multiplemailFormat: true };
            }

            else {
                return null;
            }
        };
    }
}



interface ValidationResult {
    [key: string]: boolean;
}


