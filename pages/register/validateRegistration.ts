import { isEmail, isEqual, isLongerThan } from './../../util/form-validation/string-validation'

export const validateRegistration = (name: string, email: string, password: string, pwConfirm: string, lang: string): string[] => {
    const validationErrors = [];

    const nameVal = isLongerThan(name, 1);
    if (!nameVal) {
        switch (lang) {
            case 'english':
                validationErrors.push('Name can\'t be empty');
                break;
            case 'deutsch':
                validationErrors.push('Name muss ausgefüllt werden');
                break;
        }
    }

    const emailVal = isEmail(email);
    if (!emailVal) {
        switch (lang) {
            case 'english':
                validationErrors.push('You entered an invalid email')
                break;
            case 'deutsch':
                validationErrors.push('Du hast kein richtiges Email eingegeben');
                break;
        }
    }

    const pwLongEnough = isLongerThan(password, 7);
    if (!pwLongEnough) {
        switch (lang) {
            case 'english':
                validationErrors.push('Password needs to contain at least 6 characters')
                break;
            case 'deutsch':
                validationErrors.push('Dein Passwort muss aus mindestens 6 Charaktären bestehen');
                break;
        }
    }

    const passwordVal = isEqual(password, pwConfirm);
    if (!passwordVal) {
        switch (lang) {
            case 'english':
                validationErrors.push('Passwords need to match');
                break;
            case 'deutsch':
                validationErrors.push('Die Passworte stimmen nicht überein');
                break;
        }
    }

    return validationErrors;
}