const registrationEmailTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-ffccbf1aa6c44b41a4259b7b47037506';
            break;
        case 'deutsch':
            emailTemplate = 'd-8cd8cb64690f447e99a5ae8dcd030372';
            break;
        default:
            emailTemplate = 'd-ffccbf1aa6c44b41a4259b7b47037506'
            break;
    }

    return emailTemplate;
}

module.exports = registrationEmailTemplate;