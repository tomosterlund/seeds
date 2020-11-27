const Video = require('../../../Models/lessons/Video');
const Text = require('../../../Models/lessons/Text');
const Quiz = require('../../../Models/lessons/Quiz');
const EmailLimit = require('../../../Models/TTLdata/emaillimit');
const User = require('../../../Models/User');
const sgMail = require('@sendgrid/mail');
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

        const emaillimit = await EmailLimit.findOne({ userId: lessonDoc.authorId });
        if (emaillimit) {
            if (emaillimit.emailCount >= 5) { //Checks if course author should stop receiving emails for the 12 hour period since receiving the 1st
                return
            }

            // Adds count to the course author's email limit, which is 5 per 12 hours
            emaillimit.emailCount += 1;
            await emaillimit.save();
        } else if (!emaillimit) { // if course author has not yet received any emails during the last 12 hours
            const newLimit = new EmailLimit({
                userId: lessonDoc.authorId,
                emailCount: 1
            });
            await newLimit.save();
        }

        // Sending email to notify course creator
        const receiver = await User.findById(lessonDoc.authorId).lean();
        console.log('makes it here');
        const msg = {
            to: receiver.email,
            from: 'tom.osterlund1@gmail.com',
            template_id: 'd-7b5370ac576c4fd48fdd4b358ca721f4',
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