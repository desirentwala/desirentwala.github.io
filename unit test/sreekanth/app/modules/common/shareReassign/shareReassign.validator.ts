import { FormGroup, Validators } from '@angular/forms';

export class ShareReassignFormValidator {
    shareReassignForm: FormGroup;
    setShareReassignFormValidator(shareReassignForm) {
        this.shareReassignForm = shareReassignForm;
        this.shareReassignForm.get('txnId').setValidators(Validators.compose([Validators.required]));
        this.shareReassignForm.get('txnType').setValidators(Validators.compose([Validators.required]));
        this.shareReassignForm.get('type').setValidators(Validators.compose([Validators.required]));
        this.shareReassignForm.get('shareType').setValidators(Validators.compose([Validators.required]));
        return this.shareReassignForm;
    }

    setValidatorForGroup(shareReassignForm){
        this.shareReassignForm = shareReassignForm;
        if(this.shareReassignForm.get('type').value === 'RA'){
            if(this.shareReassignForm.get('shareType').value === 'SU'){
                this.shareReassignForm.get('userId').setValidators(Validators.compose([Validators.required]));
            }else if(this.shareReassignForm.get('shareType').value === 'UG'){
                this.shareReassignForm.get('userGroupCode').setValidators(Validators.compose([Validators.required]));
                this.shareReassignForm.get('userId').setValidators(Validators.compose([Validators.required]));
            }
        }else if(this.shareReassignForm.get('type').value === 'SH'){
            if(this.shareReassignForm.get('shareType').value === 'UG'){
                this.shareReassignForm.get('userGroupCode').setValidators(Validators.compose([Validators.required]));
            }
        }
    }
}
