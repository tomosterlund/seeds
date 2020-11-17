const express = require('express');
const router = express.Router();
const LessonMessage = require('./../../Models/interaction/LessonMessage');

const getLessonMessages = async (lessonId) => {
    const lessonMessages = await LessonMessage
        .find({ lessonId: lessonId })
        .sort({ createdAt: -1 })
        .lean();
    return lessonMessages
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
        console.log(deletedMessage);
        const lessonMessages = await getLessonMessages(deletedMessage.lessonId);
        res.json({ lessonMessages });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;