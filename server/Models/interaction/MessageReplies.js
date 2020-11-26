const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    content: {
        type: String,
        require: true
    },
    replyToMsg: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        require: true
    },
    authorName: {
        type: String,
        require: true
    },
    authorImageUrl: {
        type: String,
        require: true
    },
    popularity: {
        type: Number,
        required: true
    },
    voters: {
        type: Array
    }
}, { timestamps: true });

const ReplyModel = mongoose.model('MessageReply', ReplySchema);

module.exports = ReplyModel;