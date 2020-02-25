import { FormBuilder, FormGroup } from '@angular/forms';
export class MiscSetupInfo {
    miscSetupInfoForm: FormGroup;
    constructor(public miscSetupInfoFormBuilder: FormBuilder) {
        this.miscSetupInfoForm = miscSetupInfoFormBuilder.group({
            miscType:[''],
            miscCode:[''],
            miscCodeDesc:[''],
            effectiveFrom:[''],
            effectiveTo:[''],
            startIndex : 0,
            maxRecords : 5, 
        });
    }
    getMiscSetupInfoModel() {
        return this.miscSetupInfoForm;
    }
    getMiscSetupListInfoModel() {
        return this.miscSetupInfoFormBuilder.group({
            miscType:[''],
            miscCode:[''],
            miscCodeDesc:[''],
            effectiveFrom:[''],
            effectiveTo:[''],
            startIndex : 0,
            maxRecords : 5, 
        });
    }
    setMiscSetupInfo(obj) {
        this.miscSetupInfoForm.patchValue(obj);
        this.miscSetupInfoForm.updateValueAndValidity();
    }
}
