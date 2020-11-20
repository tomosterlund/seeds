import { isEmail, isEqual, isLongerThan } from './../../util/form-validation/string-validation'

export const validateRegistration = (name: string, email: string, password: string, pwConfirm: string): string[] => {
    const validationErrors = [];

    const nameVal = isLongerThan(name, 1);
    if (!nameVal) {validationErrors.push('Name can\'t be empty')}

    const emailVal = isEmail(email);
    if (!emailVal) {validationErrors.push('You entered an invalid email')}

    const pwLongEnough = isLongerThan(password, 7);
    if (!pwLongEnough) {validationErrors.push('Password needs to contain at least 6 characters')}

    const passwordVal = isEqual(password, pwConfirm);
    if (!passwordVal) {validationErrors.push('Passwords need to match')}

    return validationErrors;
}