const langAbbreviation = (lang: string) => {
    let result = '';

    switch (lang) {
        case 'deutsch':
            result = 'DE';
            break;
        case 'english':
            result = 'ENG';
            break;
        default:
            result = 'ENG';
            break;
    }

    return result;
}

export default langAbbreviation;