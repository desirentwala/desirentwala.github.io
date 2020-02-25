import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class AviationPilotInfo {
    _aviationPilotInfoForm : FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._aviationPilotInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getAviationPilotInfo() {
        return this._aviationPilotInfoForm.group({
            appID: [' '],
            appFullName: [''],
            firstName: [''],
            lastName: [''],
            addrLine1: [''],
            addrLine2: [''],
            cityCd: [''],
            cityDesc: [''],
            stateCd: [''],
            stateDesc: [''],
            zip: [''],
            email: [''],
            cityAd: [''],
            stateAd: [''],
            isPilotCertified: [''],
            certificationNo: [''],
            certificationTypeCode: [''],
            certificationTypeDesc: [''],
            pilotFName: [''],
            pilotLName: [''],
            key: ['']
        });
    }
}
