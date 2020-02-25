import { FormControl } from '@angular/forms';

export class MaxNumberValidator {
  static maxNumber = (maxValue: number) => {
    return (control: FormControl) => {
      var num = control.value;
      if (isNaN(num) || num > maxValue) {
        return {
          maxNumber: { valid: false }
        };
      }
      return null;
    };
  };
}