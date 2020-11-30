const express = require('express');
const router = express.Router();
const LessonMessage = require('./../../Models/interaction/LessonMessage');
const MessageReply = require('./../../Models/interaction/MessageReplies');
const emailToCourseAuthor = require('./interaction-util/emailToCourseAuthor');
const emailToMessageAuthor = require('./interaction-util/emailToMessageAuthor');
const getLessonPosts = require('./interaction-util/get-lesson-posts');
const getMoreLessonPosts = require('./interaction-util/get-more-messages');

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

        const msgs = await getLessonPosts(lessonId);
        res.json({
            postedMessage: true,
            lessonMessages: msgs
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/lesson-messages/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const msgs = await getLessonPosts(lessonId);
        res.json({ msgs: msgs });
    } catch (error) {
        console.log(error);
    }
});

// Is actually a GET
router.post('/c-api/more-lesson-messages/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const currentLength = req.body.currentLength;
    console.log(currentLength);
    try {
        const msgs = await getMoreLessonPosts(lessonId, currentLength);

        if (!msgs) {
            return res.json({ noMore: true });
        }

        res.json({ msgs: msgs, noMore: false });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/c-api/lesson-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const deletedMessage = await LessonMessage.findByIdAndDelete(messageId);
        const msgs = await getLessonPosts(deletedMessage.lessonId);
        res.json({ msgs: msgs });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/reply-to-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    console.log('hits endpoint: post reply');
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
        const msg = await LessonMessage.findById(messageId);

        await emailToMessageAuthor(messageId, req.session.user.name);

        const msgs = await getLessonPosts(msg.lessonId);
        res.json({ postedReply: true, msgs: msgs });
    } catch (error) {
        console.log(error);
    }
});


router.post('/c-api/delete-reply-to-message/:replyId', async (req, res) => {
    const replyId = req.params.replyId;
    const lessonId = req.body.lessonId;
    try {
        await MessageReply.findByIdAndDelete(replyId);
        const msgs = await getLessonPosts(lessonId);
        res.json({ msgs: msgs });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;