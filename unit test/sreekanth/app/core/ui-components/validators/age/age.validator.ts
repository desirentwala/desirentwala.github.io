import { FormControl } from '@angular/forms';

interface Validator {
 [key:string]:boolean;
}
export class AgeValidator {

 static minAge = (Age:number) => {
  return (control:FormControl) => {
    var age = control.value;
    if(isNaN(age) || age < Age){
      return {
         'validateAge': {valid: false}
      };
    }
    return null;
  };
};

 static maxAge = (Age:number) => {
  return (control:FormControl) => {
    var age = control.value;
    if(isNaN(age) || age > Age){
      return {
         'validateAge': {valid: false}
      };
    }
    return null;
  };
};

}