import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class CustomerInfo {
    _customerInfoForm;
    _cardInfo;
    _additionalInsurerInfo
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        let cardInfo = quoteModelInstance.getCardInfo();
        this._cardInfo = cardInfo
        this._customerInfoForm = this.quoteModelInstance._formBuilderInstance;
        let additionalInsurerInfo = quoteModelInstance.getAdditionalInsurerInfomodel();
        this._additionalInsurerInfo = additionalInsurerInfo;
    }
    getCustomerInfoModel() {

        return this._customerInfoForm.group({
            appCode: [''],
            policyHolderType: [''],
            maritalStatus: [''],
            companyName: [''],
            companyRegNumber: [''],
            contactPersonFirstName: [''],
            contactPersonLastName: [''],
            appFName: [''],
            appLName: [''],
            appMName: [''],
            appFullName: [''],
            gender: [''],
            isPolicyHolderInsured: [''],
            passportOrNRIC: [''],
            passportNumber: [''],
            nricNumber: [''],
            isPassport: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            DOB: [''],
            age: [''],
            zipCd: [''],
            zipCdDesc: [''],
            appUnitNumber: [''],
            blockNumber: [''],
            address1: [''],
            address2: [''],
            cityCode: [''],
            cityDesc: [''],
            state: [''],
            stateDesc: [''],
            countryCode: [''],
            countryDesc: [''],
            mobilePh: [],
            homePh: [],
            officePhone: [],
            fax: [],
            emailId: [''],
            appRefNo: [''],
            existingApp: [''],
            updateApp: [''],
            pic: [''],
            prefix: [''],
            prefixDesc: [''],
            occupationCode: [''],
            industryCode: [''],
            industryDesc: [''],
            occupationDesc: [''],
            campaignCode: [''],
            areaCode: [''],
            areaCodeDesc: [''],
            otherPartyCode5: [''],
            otherPartyCode5Desc: [''],
            departmentID: [''],
            departmentName: [''],
            employeeID: [''],
            clientInfoAck: [''],
            consentForCommunication: [''],
            consentForInfoUse: [''],
            consentForInfoVerify: [''],
            apartmentNumber: [''],
            businessTypecode:[''],
            businessTypecodeDesc:[''],
            customerName:[''],
            namedInsuredLongName:[''],
            addsubsidiary:[''],
            postalcode:[''],
            countyCode:[''],
            countyDesc:[''],
            provinceTeritory:[''],
            provinceTeritoryDesc:[''],
            // stateCode:[''],
            subsidiaryneeded:[''],
            website:[''],
            attachments: this._customerInfoForm.array([
                this.getfileuploadModel(),
            ]),
            cardInfo: this._cardInfo.getAutoRenewalInfoModel(),
            from:[''],
            carbonCopy:[''],
            emailSubject:[''],
            emailBody:[''],
            textMessage:[''],
            clientUpdateFlag:[''],
            servicingAgent:[''],
            servicingAgentCd: [''],
            servicingAgentName: [''],
            servicingAgentPortalId: [''],
            introducingAgentCd: [''],
            introducingAgentPortalId: [''],
            borRequestedDate: [''],
            currentBroker:[''],
            borRequestedBy:[''],
            borStatus: [''],
            borStatusDesc:[''],
            isBorRequested: [''],
            borRequired: [''],
            branchCd:[''],
            branchDesc:[''],
            borRequestedAgentCd:[''],
            applicantIs:[''],
            isBorPending:[''],
            borAttachments:this._customerInfoForm.array([
                this.getfileuploadModel(),
            ]),
            borEndDate: [''],
            quoteVerNo:[''],
            quoteNo:[''],
            userId:[''],
            agencyCode:[''],
            agentID:[''],
            campaignCodeDesc: [''],
            empoyerCode: [''],
            employerCodeDesc: [''],
            household: [''],
            householdDesc: [''],
            agentName: [''],
            otherBusinessTypeDesc: ['']
        });
    }

    getPACustomerInfoModel() {

        return this._customerInfoForm.group({
            companyRegNumber: [''],
            appCode: [''],
            policyHolderType: [''],
            prefix: [''],
            prefixDesc: [''],
            appFName: [''],
            appMName: [''],
            appLName: [''],
            appFullName: [''],
            gender: [''],
            DOB: [''],
            isPolicyHolderInsured: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            maritalStatus: [''],
            employmentStatus: [''],
            occupationCode: [''],
            industryCode: [''],
            annualSalaryCode: [''],
            illnessCode: [''],
            illnessStartDate: [''],
            illnessEndDate: [''],
            hobbieCode: [''],
            relationWithAppCode: [''],
            beneficiaryIdentityType: [''],
            beneficiaryIdentityNo: [''],
            occupationDesc: [''],
            industryDesc: [''],
            annualSalaryDesc: [''],
            illnessDesc: [''],
            hobbieDesc: [''],
            relationWithAppDesc: [''],
            age: [''],
            zipCd: [''],
            zipCdDesc: [''],
            appUnitNumber: [''],
            blockNumber: [''],
            address1: [''],
            address2: [''],
            cityCode: [''],
            cityDesc: [''],
            state: [''],
            stateDesc: [''],
            countryCode: [''],
            countryDesc: [''],
            mobilePh: [],
            homePh: [],
            officePhone: [],
            fax: [],
            emailId: [''],
            appRefNo: [''],
            existingApp: [''],
            updateApp: [''],
            companyName: [''],
            campaignCode: [''],
            areaCode: [''],
            areaCodeDesc: [''],
            otherPartyCode5: [''],
            otherPartyCode5Desc: [''],
            departmentID: [''],
            departmentName: [''],
            employeeID: [''],
            clientInfoAck: [''],
            consentForCommunication: [''],
            consentForInfoUse: [''],
            consentForInfoVerify: [''],
            apartmentNumber: [''],
            cardInfo: this._cardInfo.getAutoRenewalInfoModel(),
            clientUpdateFlag:[''],
 			leadID: [''],
            campaignCodeDesc: [''],
            empoyerCode: [''],
            employerCodeDesc: [''],
            household: [''],
            householdDesc: [''],
	        externalIDs: this._customerInfoForm.array([ this.getExternalIDModel() ])
        });
    }
    getFIRCustomerInfoModel() {

        return this._customerInfoForm.group({
            appCode: [''],
            appRefNo: [''],
            existingApp: [''],
            updateApp: [''],
            policyHolderType: [''],
            maritalStatus: [''],
            companyRegNumber: [''],
            companyName: [''],
            prefix: [''],
            prefixDesc: [''],
            appFName: [''],
            appMName: [''],
            appLName: [''],
            appFullName: [''],
            gender: [''],
            DOB: [''],
            age: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            occupationCode: [''],
            occupationDesc: [''],
            industryCode: [''],
            industryDesc: [''],
            zipCd: [''],
            zipCdDesc: [''],
            appUnitNumber: [''],
            blockNumber: [''],
            address1: [''],
            address2: [''],
            cityCode: [''],
            cityDesc: [''],
            state: [''],
            stateDesc: [''],
            countryCode: [''],
            countryDesc: [''],
            mobilePh: [],
            homePh: [],
            officePhone: [],
            fax: [],
            emailId: [''],
            campaignCode: [''],
            areaCode: [''],
            areaCodeDesc: [''],
            otherPartyCode5: [''],
            otherPartyCode5Desc: [''],
            departmentID: [''],
            departmentName: [''],
            employeeID: [''],
            apartmentNumber: [''],
            clientInfoAck: [''],
            consentForCommunication: [''],
            consentForInfoUse: [''],
            consentForInfoVerify: [''],
            cardInfo: this._cardInfo.getAutoRenewalInfoModel(),
            clientUpdateFlag: [''],
            leadID: [''],
            campaignCodeDesc: [''],
            empoyerCode: [''],
            employerCodeDesc: [''],
            household: [''],
            householdDesc: ['']
        });
    }
    getMTRCustomerModel() {

        return this._customerInfoForm.group({
            companyRegNumber: [''],
            appCode: [''],
            policyHolderType: [''],
            prefix: [''],
            prefixDesc: [''],
            appFName: [''],
            appMName: [''],
            appLName: [''],
            appFullName: [''],
            gender: [''],
            DOB: [''],
            isPolicyHolderInsured: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            maritalStatus: [''],
            employmentStatus: [''],
            occupationCode: [''],
            industryCode: [''],
            annualSalaryCode: [''],
            illnessCode: [''],
            illnessStartDate: [''],
            illnessEndDate: [''],
            hobbieCode: [''],
            relationWithAppCode: [''],
            beneficiaryIdentityType: [''],
            beneficiaryIdentityNo: [''],
            occupationDesc: [''],
            industryDesc: [''],
            annualSalaryDesc: [''],
            illnessDesc: [''],
            hobbieDesc: [''],
            relationWithAppDesc: [''],
            age: [''],
            zipCd: [''],
            zipCdDesc: [''],
            appUnitNumber: [''],
            blockNumber: [''],
            address1: [''],
            address2: [''],
            cityCode: [''],
            cityDesc: [''],
            state: [''],
            stateDesc: [''],
            countryCode: [''],
            countryDesc: [''],
            mobilePh: [],
            homePh: [],
            officePhone: [],
            fax: [],
            emailId: [''],
            appRefNo: [''],
            existingApp: [''],
            updateApp: [''],
            companyName: [''],
            campaignCode: [''],
            areaCode: [''],
            areaCodeDesc: [''],
            otherPartyCode5: [''],
            otherPartyCode5Desc: [''],
            departmentID: [''],
            departmentName: [''],
            employeeID: [''],
            clientInfoAck: [''],
            consentForCommunication: [''],
            consentForInfoUse: [''],
            consentForInfoVerify: [''],
            apartmentNumber: [''],
            cardInfo: this._cardInfo.getAutoRenewalInfoModel(),
            clientUpdateFlag: [''],
            leadID: [''],
            campaignCodeDesc: [''],
            empoyerCode: [''],
            employerCodeDesc: [''],
            household: [''],
            householdDesc: ['']
        });
    }
    getfileuploadModel() {
        return this._customerInfoForm.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            documentContent: [''],
        });
    }

    getExternalIDModel() {
        return this._customerInfoForm.group({
            purpose: [''],
            id: [''],
            key: ['']
        });
    }

    getLIFCustomerInfoModel() {
        let customerInfo: FormGroup = this.getCustomerInfoModel();
        customerInfo.addControl('height', new FormControl(''));
        customerInfo.addControl('weight', new FormControl(''));
        customerInfo.addControl('heightUnitCode', new FormControl(''));
        customerInfo.addControl('heightUnitDesc', new FormControl(''));
        customerInfo.addControl('weightUnitCode', new FormControl(''));
        customerInfo.addControl('weightUnitDesc', new FormControl(''));
        customerInfo.addControl('relationWithAppCode', new FormControl(''));
        customerInfo.addControl('relationWithAppDesc', new FormControl(''));
        customerInfo.addControl('appFatherName', new FormControl(''));
        customerInfo.addControl('beneficiaryLevelCode', new FormControl(''));
        customerInfo.addControl('beneficiaryLevelDesc', new FormControl(''));
        customerInfo.addControl('customerCode', new FormControl(''));
        customerInfo.addControl('customerDesc', new FormControl(''));
        customerInfo.addControl('partyExistsFlag', new FormControl(''));
        customerInfo.addControl('createPartyFlag', new FormControl(''));
        customerInfo.addControl('occupationCode', new FormControl(''));
        customerInfo.addControl('occupationLevel', new FormControl(''));
        customerInfo.addControl('occupation', new FormControl(''));
        customerInfo.addControl('occupationDesc', new FormControl(''));
        customerInfo.addControl('beneficiaryShare', new FormControl(''));
        customerInfo.addControl('formatedBeneficiaryShare', new FormControl(''));
        customerInfo.addControl('key', new FormControl(''));
        customerInfo.addControl('roleType', new FormControl(''));
        customerInfo.addControl('quoteVerNo', new FormControl(''));
        customerInfo.addControl('quoteNo', new FormControl(''));
        customerInfo.addControl('maturityBeneficiaryType', new FormControl(''));
        customerInfo.addControl('maturityBeneficiaryTypeDesc', new FormControl(''));
        return customerInfo;
    }

    getAviCustomerInfoModel(){
        let customerInfo: FormGroup = this.getCustomerInfoModel();
        customerInfo.addControl('typeOfCorporateCode', new FormControl());
        customerInfo.addControl('typeOfCorporateDesc', new FormControl());
        customerInfo.addControl('website', new FormControl());
        customerInfo.addControl('underwriter', new FormControl());
        customerInfo.addControl('applicantIs', new FormControl());
        customerInfo.addControl('applicantIsCode', new FormControl());
        customerInfo.addControl('applicantIsDesc', new FormControl());
        customerInfo.addControl('subsidiary', new FormControl());
        customerInfo.addControl('accountInfo', new FormArray([]));
        customerInfo.addControl('autoRenewalFlag', new FormControl());
        customerInfo.addControl('otherBusinessTypeDesc', new FormControl());
        customerInfo.addControl('timeZone', new FormControl());
        let accountInfo: FormArray = <FormArray>customerInfo.get('accountInfo');
        accountInfo.push(this.getCustomerInfoModel());
        customerInfo.addControl('additionalInsurerList', new FormArray([]));
        customerInfo.addControl('municipalityCode', new FormControl());
        let additionalInsurerList: FormArray = <FormArray>customerInfo.get('additionalInsurerList');
        additionalInsurerList.push(this._additionalInsurerInfo.getAdditionalInsurerInfomodel());
        return customerInfo;
    }
}