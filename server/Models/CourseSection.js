const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    lessons: {
        type: Array
    }
})

const CourseSectionModel = mongoose.model('CourseSection', CourseSectionSchema);

module.exports = CourseSectionModel;