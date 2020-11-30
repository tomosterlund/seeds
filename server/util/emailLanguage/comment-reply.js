const commentReplyEmailTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-40754a3583de4004a26fcf007d10e116';
            break;
        case 'deutsch':
            emailTemplate = 'd-0ad34364c88d4f8982e7a85267ceaca2';
            break;
        default:
            emailTemplate = 'd-40754a3583de4004a26fcf007d10e116'
            break;
    }

    return emailTemplate;
}

module.exports = commentReplyEmailTemplate;