const resetPasswordTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-6b30d63a704245a1ba456d2aa4f0effd';
            break;
        case 'deutsch':
            emailTemplate = '';
            break;
        default:
            emailTemplate = 'd-6b30d63a704245a1ba456d2aa4f0effd';
            break;
    }

    return emailTemplate;
}

module.exports = resetPasswordTemplate;