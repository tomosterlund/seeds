export const checkFileFormat = (filename: string, acceptedMimetypes: string[]): boolean => {
    const stringArr = filename.split('')

    while (stringArr.length > 3) {
        if (stringArr.length > 3) {
            stringArr.shift();
        }
    }

    const chosenType = stringArr.join('');

    for (let i = 0; i < acceptedMimetypes.length; i++) {
        if (acceptedMimetypes[i] === chosenType) {
            return true
        }
    }

    return false
}