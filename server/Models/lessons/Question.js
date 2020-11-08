const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    lessonId: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answers: {
        type: Array
    },
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = QuestionModel;