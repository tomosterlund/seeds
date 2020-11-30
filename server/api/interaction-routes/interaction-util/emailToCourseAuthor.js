const Video = require('../../../Models/lessons/Video');
const Text = require('../../../Models/lessons/Text');
const Quiz = require('../../../Models/lessons/Quiz');
const User = require('../../../Models/User');
const emailLimitCheck = require('./emailLimitCheck');
const sgMail = require('@sendgrid/mail');
const commentOnLessonTemplate = require('../../../util/emailLanguage/comment-on-course');
sgMail.setApiKey(process.env.SENDGRID);

const emailToCourseAuthor = async (lessonId, senderName, senderId) => {
    let lessonDoc;
    try {
        const video = await Video.findById(lessonId);
        const text = await Text.findById(lessonId);
        const quiz = await Quiz.findById(lessonId);
        if (video) {lessonDoc = video}
        if (text) {lessonDoc = text}
        if (quiz) {lessonDoc = quiz}

        // If the course author replies to their own course, return without sending anything.
        if (lessonDoc.authorId === senderId) {
            return;
        }

        const emailLimit = emailLimitCheck(lessonDoc.authorId);
        if (!emailLimit) {
            return;
        }

        // Sending email to notify course creator
        const receiver = await User.findById(lessonDoc.authorId).lean();
        const dynamicTemplate = commentOnLessonTemplate(receiver.language);

        const msg = {
            to: receiver.email,
            from: 'tom.osterlund1@gmail.com',
            template_id: dynamicTemplate,
            dynamic_template_data: {
                receivername: receiver.name,
                sendername: senderName,
                lessonname: lessonDoc.title,
                lessonid: lessonDoc._id
            },
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent to course author')
            })
            .catch((error) => {
                console.error(error)
            })

        return lessonDoc
    } catch (error) {
        console.log(error);
    }
}

module.exports = emailToCourseAuthor;