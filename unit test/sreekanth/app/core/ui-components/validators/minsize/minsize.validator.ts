import { FormControl } from '@angular/forms';

export class MinSizeValidator {
    static minSize = (minValue: number) => {
        return (control: FormControl) => {
            var size=0;
            if (control.value) {
                size = control.value.length;
            }
            if (size < minValue) {
                return {
                    minSize: { valid: false }
                };
            }
            return null;
        };
    };
}
