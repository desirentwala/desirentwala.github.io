import { FormBuilder, FormGroup } from '@angular/forms';

export class MakeModelInfo {
    makeModelInfoForm: FormGroup;
    constructor(public formBuilder: FormBuilder) {
        this.makeModelInfoForm = formBuilder.group({
            makeCode:[''],
            makeCodeDesc:[''],
            modelCode:[''],
            modelCodeDesc:['']           
        });
    }

    getMakeModelInfo() {
        return this.makeModelInfoForm;
    } 

    getSearchmodal() {
        return this.formBuilder.group({
            makeCode:[''],
            makeCodeDesc:[''],
            modelCode:[''],
            modelCodeDesc:[''],
        });
    }

    getMakeListInfo() {
        return this.formBuilder.group({
            makeCode:[''],
            modelCode:[''],
            makeCodeDesc:[''],
            startIndex : 0,
            maxRecords : 5,
        });
    }

    

    getModelListInfo() {
        return this.formBuilder.group({
            makeCode:[''],
            modelCode:[''],
            modelCodeDesc:[''],
            startIndex : 0,
            maxRecords : 5,
        });
    }

    setMakeModelInfo(obj) {
        this.makeModelInfoForm.patchValue(obj);
        this.makeModelInfoForm.updateValueAndValidity();
    }
}