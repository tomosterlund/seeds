const express = require('express');
const router = express.Router();
const LessonMessage = require('./../../Models/interaction/LessonMessage');
const MessageReply = require('./../../Models/interaction/MessageReplies');
const emailToCourseAuthor = require('./emailToCourseAuthor');

const getLessonMessages = async (lessonId) => {
    const lessonMessages = await LessonMessage
        .find({ lessonId: lessonId })
        .sort({ createdAt: -1 })
        .lean();
    return lessonMessages
};

const getReplies = async (replyToMsg) => {
    const replies = await MessageReply
        .find({ replyToMsg: replyToMsg })
        .sort({ createdAt: -1 })
        .lean();
    return replies
}

router.post('/c-api/lesson-message/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const message = req.body.message;
    const user = req.session.user;
    try {
        const newMessaage = new LessonMessage({
            content: message,
            lessonId: lessonId,
            authorName: user.name,
            authorId: user._id,
            authorImageUrl: user.imageUrl,
            popularity: 0,
            voters: []
        })
        await newMessaage.save();

        emailToCourseAuthor(lessonId, user.name, user._id);

        const lessonMessages = await getLessonMessages(lessonId);
        res.json({
            postedMessage: true,
            lessonMessages: lessonMessages
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/lesson-messages/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const lessonMessages = await getLessonMessages(lessonId);
        res.json({ lessonMessages });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/c-api/lesson-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const deletedMessage = await LessonMessage.findByIdAndDelete(messageId);
        const lessonMessages = await getLessonMessages(deletedMessage.lessonId);
        res.json({ lessonMessages });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/reply-to-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const newReply = new MessageReply({
            content: req.body.content,
            replyToMsg: messageId,
            authorId: req.session.user._id,
            authorName: req.session.user.name,
            authorImageUrl: req.session.user.imageUrl,
            popularity: 0,
        });
        await newReply.save();

        const updatedReplies = getReplies(messageId);
        console.log(updatedReplies);
        res.json({ postedReply: true });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;