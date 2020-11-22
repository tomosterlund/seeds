const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
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
    }
});

const VideoModel = mongoose.model('Video', VideoSchema);

module.exports = VideoModel;