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

const getMsgObjects = async (lessonId) => {
    // GET all messages
    const lessonMessages = await getLessonMessages(lessonId);
    const lessonMsgsIds = []
    for (let lm of lessonMessages) {
        lessonMsgsIds.push(lm._id);
    }

    // GET all replies to the messages
    const lessonReplies = await MessageReply
        .find({ replyToMsg: [...lessonMsgsIds] })
        .sort({ createdAt: 1 })
        .lean();

    // PUT together messages with their replies (try and do this in the aggregation framework?)
    const msgs = [];
    for (let lmsg of lessonMessages) {
        let ms = {msg: undefined, replies: []}
        ms.msg = lmsg;
        for (let rpl of lessonReplies) {
            if (lmsg._id == rpl.replyToMsg) {
                console.log('found a relevant reply');
                ms.replies.push(rpl);
            }
        }
        msgs.push(ms);
    }

    return msgs;
}

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

        const lessonMessages = await getMsgObjects(lessonId);
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
        const msgs = await getMsgObjects(lessonId);
        res.json({ msgs });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/c-api/lesson-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const deletedMessage = await LessonMessage.findByIdAndDelete(messageId);
        const lessonMessages = await getMsgObjects(deletedMessage.lessonId);
        res.json({ lessonMessages });
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

        const msgs = await getMsgObjects(msg.lessonId);
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
        const msgs = await getMsgObjects(lessonId);
        res.json({ msgs: msgs });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;