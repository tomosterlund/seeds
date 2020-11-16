const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonMessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    lessonId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
        required: true
    },
    voters: {
        type: Array
    }
});

const LessonMessageModel = mongoose.model('Lessonmessage', LessonMessageSchema);

module.exports = LessonMessageModel;