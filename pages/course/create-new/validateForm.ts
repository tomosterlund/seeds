import { isLongerThan } from './../../../util/form-validation/string-validation'

const validateForm = (str: string):boolean => {
    const strBool = isLongerThan(str, 1);
    return strBool
}

export default validateForm;