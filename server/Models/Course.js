const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    },
    sections: {
        type: Array
    },
    lessonIds: {
        type: Array
    },
    authorName: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
        required: true
    },
    subscribers: {
        type: Array
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
});

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel;