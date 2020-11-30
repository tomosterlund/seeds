const commentOnLessonTemplate = (lang) => {
    let emailTemplate = '';

    switch (lang) {
        case 'english':
            emailTemplate = 'd-7b5370ac576c4fd48fdd4b358ca721f4';
            break;
        case 'deutsch':
            emailTemplate = 'd-3549638ad4a142fd8aa32fc8d2476c66';
            break;
        default:
            emailTemplate = 'd-7b5370ac576c4fd48fdd4b358ca721f4'
            break;
    }

    return emailTemplate;
}

module.exports = commentOnLessonTemplate;