import { CustomerInfo } from './../../claims/models/customerInfo.model';
import { FormBuilder } from '@angular/forms';
import { NomineeInfo } from './nomineInfo.model';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class InsuredInfo {
    _InsuredInfoForm: FormBuilder;
    nomineeInfo: NomineeInfo;
    customerInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._InsuredInfoForm = this.quoteModelInstance._formBuilderInstance;
        this.nomineeInfo = this.quoteModelInstance.getNomineeModel();
        let _customerInfo = quoteModelInstance.getCustomerInfo();
        this.customerInfo = _customerInfo;
    }
    getInsuredInfoModel() {
        let date = new Date();
        // tslint:disable-next-line:max-line-length
        let travellerKey = date.getFullYear() + '' + date.getMonth() + '' + date.getUTCDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds();
        return this._InsuredInfoForm.group({
            appID: [' '],
            appFullName: [''],
            appFName: [''],
            appLName: [''],
            gender: [''],
            hkidOrPassport: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            isPassport: [''],
            DOB: [''],
            age: [''],
            chinaMedPass: [''],
            relationWithAppCode: [''],
            relationWithAppDesc: [''],
            itemNo: [''],
            sectNo: [''],
            key: [travellerKey],
            passportNumber: [''],
            nricNumber: [''],
            travellerStatusCode: ['N'],
            effectiveDate: [''],
            mobilePh: [''],
            homePh: [''],
            nomineeList: this._InsuredInfoForm.array([
                this.nomineeInfo.getNomineeInfo()
            ])
        });
    }
    getPAInsuredInfoModel() {

        return this._InsuredInfoForm.group({
            appCode: [''],
            policyHolderType: ['I'],
            appFullName: [''],
            appFName: [''],
            appMName: [''],
            appLName: [''],
            genderCode: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            isPassport: [''],
            DOB: [''],
            age: [''],
            beneficiaryCode: [''],
            beneficiaryDesc: [''],
            relationshipToInsuredCode: [''],
            relationshipToInsuredDesc: [''],
            relationWithAppCode: [''],
            relationWithAppDesc: [''],
            beneficiaryName: [''],
            beneficiaryAge: [''],
            beneficiaryGenderCode: [''],
            emailId: [''],
            mobilePh: [''],
            homePh: [''],
            appUnitNumber: [''],
            key: [''],
            nomineeList: this._InsuredInfoForm.array([
                this.nomineeInfo.getNomineeInfo()
            ])
        });
    }
    getMotorInsuredInfoModel() {
        return this._InsuredInfoForm.group({
            drivingExpInYears: [''],
            policyHolderType: ['I'],
            appCode: [''],
            appFullName: [''],
            appFName: [''],
            appMName: [''],
            appLName: [''],
            genderCode: ['M'],
            genderDesc: [''],
            maritalStatusCode: ['S'],
            maritalStatusDesc: [''],
            hasDrivingLicense: [],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            DOB: [''],
            age: [''],
            demeritPoints: [''],
            relationWithAppCode: [''],
            relationWithAppDesc: [''],
            driverStatusCode: ['N'],
            licenseRevokationCount: [''],
            claimCount: [''],
            licenseNo: [''],
            licenseIssueDate: [''],
            seqNo: [''],
            key: ['01']
        });
    }

    getLifeInsuredInfoModel(){
        return this.customerInfo.getLIFCustomerInfoModel();
    }
}
