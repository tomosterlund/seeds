const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String,
        required: true
    },
    views: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
        required: true
    }
});

const TextModel = mongoose.model('Text', TextSchema);

module.exports = TextModel;