import { FormControl } from '@angular/forms';

export class MaxSizeValidator {
    static maxSize = (maxValue: number) => {
        return (control: FormControl) => {
            var size=0;
            if (control.value) {
                size = control.value.length;
            }
            if (size > maxValue) {
                return {
                    maxSize: { valid: false }
                };
            }
            return null;
        };
    };
}
