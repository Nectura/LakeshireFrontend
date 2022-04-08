import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validatePasswordInput(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) {
        return null;
    }

    const hasUpper = hasAtLeastOneCapitalLetter(value);
    const hasLower = hasAtLeastOneLowerLetter(value);
    const hasNumber = hasAtLeastOneDigit(value);
    const hasSpecial = hasAtLeastOneSpecialCharacter(value);
    const hasMinLength = hasTheMinimumAmountOfCharacters(value);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial || !hasMinLength) {
        return {
            'noUpper': !hasUpper,
            'noLower': !hasLower,
            'noNumber': !hasNumber,
            'noSpecial': !hasSpecial,
            'noMinLength': !hasMinLength
        };
    }

    return null;
}

function hasAtLeastOneCapitalLetter(input: string) {
    return /[A-Z]/.test(input);
}

function hasAtLeastOneLowerLetter(input: string) {
    return /[a-z]/.test(input);
}

function hasAtLeastOneDigit(input: string) {
    return /\d/.test(input);
}

function hasAtLeastOneSpecialCharacter(input: string) {
    return /[-+_!@#$%^&*.,?]/.test(input);
}

function hasTheMinimumAmountOfCharacters(input: string) {
    return input.length >= 8;
}