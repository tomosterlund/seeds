const newEmailTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-450bcdf6f641480087c0a8c9393b49fb';
            break;
        case 'deutsch':
            emailTemplate = 'd-df51cc02feda4609a57c4d868ece15da';
            break;
        default:
            emailTemplate = 'd-450bcdf6f641480087c0a8c9393b49fb'
    }

    return emailTemplate;
}

module.exports = newEmailTemplate;