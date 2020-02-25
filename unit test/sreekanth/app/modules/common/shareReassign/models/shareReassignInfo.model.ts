import { FormGroup, FormBuilder } from '@angular/forms';

export class ShareReassignInfo {
    shareReassignInfoForm: FormGroup

    constructor(public shareReassignInfoFormBuilder: FormBuilder) {
        this.shareReassignInfoForm = shareReassignInfoFormBuilder.group({
            txnId: [''],
            txnVerNo: [''],
            txnType: [''],
            shareType: [''],
            shareTypeDesc: [''],
            userGroupCode: [''],
            userGroupDesc:[''],
            userId:[''],
            userIdDesc:[''],
            type:[''],
            permissions:['']
        });
    }

     getShareReassingInfoModel() {
        return this.shareReassignInfoForm;
    } 

}