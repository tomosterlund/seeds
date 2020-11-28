const Video = require('./../../Models/lessons/Video');
const deleteMedia = require('./../deleteMedia');

const deleteVideoLesson = async (lessonId) => {
    try {
        const video = await Video.findById(lessonId);
        await deleteMedia(video.videoUrl);
        await Video.findByIdAndDelete(lessonId);
        console.log('deleted video');
    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteVideoLesson;