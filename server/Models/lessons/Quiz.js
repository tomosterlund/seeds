const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    questionIds: {
        type: Array
    },
    authorId: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    popularity: {
        type: Number,
        required: true
    }
});

const QuizModel = mongoose.model('Quiz', QuizSchema);

module.exports = QuizModel;