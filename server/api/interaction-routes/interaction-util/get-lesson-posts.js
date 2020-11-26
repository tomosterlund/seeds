const LessonMessage = require('./../../../Models/interaction/LessonMessage');
const MessageReply = require('./../../../Models/interaction/MessageReplies');

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

module.exports = getMsgObjects;