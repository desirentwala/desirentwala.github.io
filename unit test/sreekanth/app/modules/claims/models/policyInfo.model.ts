import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class PolicyInfo {
    policyInfoForm;

    constructor(public claimModelInstance : DefaultClaimModel ) {
        this.policyInfoForm = this.claimModelInstance._formBuilderInstance;
    }

    getPolicyInfoModel() {

        return this.policyInfoForm.group({
           
            policyNo: [''],
            referenceNo: [''],
            referenceType: ['RTCL'],
            policyEndtNo: [''],
            agentCd: [''],
            agentName: [''],
            branchCd: [''],
            branchDesc: [''],
            category: [''],
            inceptionDt: [''],
            expiryDt: [''],
            productCd: [''],
            productDesc: [''],
            itemNo: [''],
            sectionNo: [''],
            rbg: [''],
            isImportantNoticeEnabled: [''],
            isWarantyAndDeclarationEnabled: [''],
            isPersonalInfoStatementEnabled: [''],
            riskAddress1:[''],
            riskAddress2:[''],
            riskAddress3:[''],
            riskAddress4:[''],
            chkListId:[''],
            hobbyRec:['']
        });
    }
   
}