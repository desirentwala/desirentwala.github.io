import { FormControl } from '@angular/forms';

interface Validator {
  [key: string]: boolean;
}
export class DateValidator {

  static validateDate(control: FormControl): Validator {


    if (control.value.length === 10) {
      let dateValue = control.value;
      let validDate;
      let splitString = dateValue.substring(2, 3);
      let splitDate = dateValue.split(splitString);
      let dateFormat = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
      let year = dateFormat.getFullYear();
      let month = dateFormat.getMonth() + 1;
      let date = dateFormat.getDate();
        if ( (year % splitDate[2]) === 0 &&  (year /splitDate[2])=== 1 && (month % splitDate[1]) === 0 && (month /splitDate[1]) === 1  && (date % splitDate[0]) ===  0 && (date /splitDate[0])===1) {
          validDate = true;
        } else {
          validDate = false;
        }
      if (!validDate) {
        return { 'validateDate': true };
      }
    }
    return null;
  }

}