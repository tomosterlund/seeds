const express = require('express');
const router = express.Router();
const LessonMessage = require('./../../Models/interaction/LessonMessage');
const getLessonMsgs = require('./interaction-util/get-lesson-posts');

router.post('/c-api/like-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    const voterId = req.body.voterId;
    const lessonId = req.body.lessonId;
    try {
        const msg = await LessonMessage.findById(messageId);
        msg.voters.push(voterId);
        msg.popularity += 1;
        await msg.save();

        const msgs = await getLessonMsgs(lessonId);
        res.json({ msgs: msgs })
    } catch (error) {
        console.log(error);
    }    
});

router.post('/c-api/unlike-message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;
    const voterId = req.body.voterId;
    const lessonId = req.body.lessonId;
    console.log('hit endpoint: unlike message');
    try {
        const msg = await LessonMessage.findById(messageId);
        let usrIdx;
        for (let i = 0; i < msg.voters.length; i++) {
            if (msg.voters[i] == voterId) {
                console.log(i);
                console.log('found user');
                usrIdx = i;
            }
        }
        msg.voters.splice(usrIdx, 1);
        msg.popularity -= 1;
        await msg.save();

        const msgs = await getLessonMsgs(lessonId);
        res.json({msgs: msgs})
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;