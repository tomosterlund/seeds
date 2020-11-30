const User = require('./../../../Models/User');
const Message = require('./../../../Models/interaction/LessonMessage');
const Video = require('../../../Models/lessons/Video');
const Text = require('../../../Models/lessons/Text');
const Quiz = require('../../../Models/lessons/Quiz');
const emailLimitCheck = require('./emailLimitCheck');
const sgMail = require('@sendgrid/mail');
const commentReplyEmailTemplate = require('../../../util/emailLanguage/comment-reply');
sgMail.setApiKey(process.env.SENDGRID);

const emailToMessageAuthor = async (messageId, senderName) => {
    let lessonDoc;

    try {
        // Check whether the user has already received 5 emails during the last 12 hours or not
        const message = await Message.findById(messageId);
        const emailLimit = emailLimitCheck(message.authorId);

        if (!emailLimit) {
            return;
        }

        // Find lesson, in order to print out lesson name and id in email
        const video = await Video.findById(message.lessonId);
        const text = await Text.findById(message.lessonId);
        const quiz = await Quiz.findById(message.lessonId);
        if (video) {lessonDoc = video}
        if (text) {lessonDoc = text}
        if (quiz) {lessonDoc = quiz}
        
        const receiver = await User.findById(message.authorId);
        const dynamicTemplate = commentReplyEmailTemplate(receiver.language);

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
        
        return;

    } catch (error) {
        console.log(error);
    }
}

module.exports = emailToMessageAuthor;