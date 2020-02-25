import { FormControl } from '@angular/forms';

export class MinNumberValidator {
  static minNumber = (minValue: number) => {
    return (control: FormControl) => {
      var num = control.value;
      if (isNaN(num) || num < minValue) {
        return {
          minNumber: { valid: false }
        };
      }
      return null;
    };
  };
}
