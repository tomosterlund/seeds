const express = require('express');
const router = express.Router();
const uploadVideo = require('./../../util/uploadVideo');
const deleteMedia = require('./../../util/deleteMedia')
const Course = require('./../../Models/Course');
const Section = require('./../../Models/CourseSection');
const Video = require('./../../Models/lessons/Video');
const deleteLessonInCourse = require('./../../util/DBUtil/deleteLessonInCourse');
const deleteLessonInSection = require('../../util/DBUtil/deleteLessonInSection');
const pushLessonIntoCourse = require('../../util/DBUtil/pushLessonIntoCourse');

router.post('/c-api/course/:courseId/add-video', uploadVideo(), async (req, res) => {
    const videoData = JSON.parse(req.body.title);
    const title = videoData.title;
    const courseId = videoData.courseId;
    const sectionId = videoData.sectionId;
    const lessonType = 'video'
    let videoUrl = null;
    if (req.file) {
        videoUrl = req.file.key;
    }
    try {
        // Create video document
        const newVideo = new Video({
            title: title,
            videoUrl: videoUrl,
            courseId: courseId,
            authorId: req.session.user._id,
            authorName: req.session.user.name,
            authorImageUrl: req.session.user.imageUrl
        });
        const savedVideo = await newVideo.save()
        const lessonId = String(savedVideo._id);

        // Update section
        const section = await Section.findById(sectionId);
        section.lessons.push({ title, lessonId, lessonType });
        await section.save()

        // Update course
        await pushLessonIntoCourse(lessonId, courseId);
        
        res.json({ uploadedVideo: true });
    } catch (error) {
        console.log(error);
    }
});

router.post(`/c-api/delete-video/:lessonId`, async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    try {
        const videoToDelete = await Video.findById(lessonId).lean();
        await deleteMedia(videoToDelete.videoUrl);
        await Video.findByIdAndDelete(lessonId);
        const section = await deleteLessonInSection(lessonId, sectionId);
        await deleteLessonInCourse(section.courseId, lessonId);
        res.json({ deletedVideo: true });
    } catch (error) {
        console.log(error);
    }
})

router.post('/c-api/edit-video-title/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    const newTitle = req.body.newTitle;
    try {
        // Edit video
        const video = await Video.findById(lessonId);
        video.title = newTitle;
        await video.save();

        // Edit in course section
        const section = await Section.findById(sectionId);
        let thisLessonIndex;
        for (let i = 0; i < section.lessons.length; i++) {
            if (section.lessons[i].lessonId == lessonId) {
                thisLessonIndex = i;
            }
        }
        section.lessons.splice(thisLessonIndex, 1, { title: newTitle, lessonId: lessonId, lessonType: 'video' });
        await section.save();

        res.json({ postedTitle: true });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;