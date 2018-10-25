import { AbstractControl, Validator } from '@angular/forms';


export function ValidateCategory(control: AbstractControl) {
    console.log('validator for category: ' + control.value);
    if ((control.value) === '0') {
        return { validCategory: true };
    }
    return null;
}
