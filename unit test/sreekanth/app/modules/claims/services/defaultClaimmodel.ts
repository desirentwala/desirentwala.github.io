import { DocumentInfo, PolicyInfo, ClaimInfo, ReferDocumentInfo, ClaimFnolInfo, ClaimTempDetailsInfo, CustomerInfo, ClaimantInfo, ClaimCodeReserveInfo, SelectedInsuredInfo, InsuredInfo, QuestionnairesInfo, Attachments, EmailQuotInfo } from '../models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IModel } from '../../../core/services/iModel.service';

export class DefaultClaimModel implements IModel{
    constructor(public _formBuilderInstance: FormBuilder) { }
    
    public getClaimInfo() {
        return new ClaimInfo(this);
    }

    public getDocumentInfo() {
        return new DocumentInfo(this);
    }
    
    public getPolicyInfo() {
        return new PolicyInfo(this);
    }

    public getClaimFnolInfo() {
        return new ClaimFnolInfo(this);
    }

    public getClaimTempDetailsInfo() {
        return new ClaimTempDetailsInfo(this);
    }

    public getCustomerInfo() {
        return new CustomerInfo(this);
    }

    public getClaimantInfo() {
        return new ClaimantInfo(this);
    }
    public getClaimCodeReserveInfo() {
        return new ClaimCodeReserveInfo(this);
    }

    public getSelectedInsuredInfo() {
        return new SelectedInsuredInfo(this);
    }

    public getInsuredInfo() {
        return new InsuredInfo(this);
    }

    public getQuestionnairesInfo() {
        return new QuestionnairesInfo(this);
    }
    public getAttachments() {
        return new Attachments(this);
    }
    public getEmailQuotInfo() {
        return new EmailQuotInfo(this);
    }
}
