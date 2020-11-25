const resetPasswordTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-6b30d63a704245a1ba456d2aa4f0effd';
            break;
        case 'deutsch':
            emailTemplate = 'd-3317d831d45441c99a02dd1f15c95a12';
            break;
        default:
            emailTemplate = 'd-6b30d63a704245a1ba456d2aa4f0effd';
            break;
    }

    return emailTemplate;
}

module.exports = resetPasswordTemplate;