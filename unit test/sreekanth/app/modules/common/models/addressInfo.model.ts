import { FormBuilder} from '@angular/forms';

export class AddressInfo {
    AddressInfoForm: FormBuilder;
    constructor() {
        this.AddressInfoForm.group({
            zipCd: [''],
            appUnitNumber: [''],
            blockNumber: [''],
            address1: [''],
            address2: [''],
            city: [''],
            state: [''],
            country: [''],
            mobilePh: [''],
            emailId: ['']
        });
    }
}