import { FormBuilder } from '@angular/forms';

export class UserProfileViewModel {
    userDetailsForm;
    modalForm;
    personalDetailsForm;
    alluserDetailsForm ;
    constructor(formBuilder: FormBuilder) {
        this.userDetailsForm = formBuilder;
        this.modalForm = formBuilder;
        this.personalDetailsForm = formBuilder;
        this.alluserDetailsForm = formBuilder;
    }
    getuserDetailsForm() {
        return this.userDetailsForm.group({
            user_id: [''],
            user_name: [''],
            roleId: [''],
            roleId_desc: [''],
            user_branch: [''],
            user_branch_desc: [''],
            user_lang_code: [''],
            user_lang_desc:[''],
            user_mobile: [''],
            current_password: [''],
            user_img:['']
        });
    }
     getpersonalDetailsForm(){
        return this.personalDetailsForm.group({
            dob: [''],
            age: [''],
            gender: [''],
            addressLine1: [''],
            addressLine2: [''],
            zipcode: [''],
            city: [''],
            user_phone:[''],
            user_mobile:[''] ,
            details: this.detailsInfo()
        });
    }
   getUserdetail(){
          return this.alluserDetailsForm.group({          
            user_id: [''],
            user_name: [''],
            roleId: [''],
            roleId_desc: [''],
            user_branch: [''],
            user_lang_code: [''],
            user_lang_desc:[''],
            user_mobile: [''],
            current_password: [''],
            dob: [''],
            age: [''],
            gender: [''],
            addressLine1: [''],
            addressLine2: [''],
            zipcode: [''],
            city: [''],
            user_phone: [''],
            user_img:['']
          
        });

   }     
    getModalForm() {
        return this.modalForm.group({
            current_password: [''],
            user_password: [''],
            confirm_password: [''],
            recoveryQuestion1_code: [''],
            recoveryQuestion1_desc: [''],
            recoveryAnswer1: [''],
            recoveryQuestion2_code: [''],
            recoveryQuestion2_desc: [''],
            salt: [''],
            oneTimeSalt: [''],
            recoveryAnswer2: ['']
        });
    }

    detailsInfo() {
        return this.userDetailsForm.group({
        });
    }
}