const express = require('express');
const router = express.Router();
const User = require('./../Models/User');
const Course = require('./../Models/Course');
const CourseSection = require('./../Models/CourseSection');
const Video = require('./../Models/lessons/Video');
const Text = require('./../Models/lessons/Text');
const Quiz = require('./../Models/lessons/Quiz');
const Question = require('./../Models/lessons/Question');

const uploadImage = require('./../util/uploadImage');
const deleteLessonInCourse = require('../util/DBUtil/deleteLessonInCourse');
const deleteVideo = require('../util/deleteMedia');
const deleteMedia = require('../util/deleteMedia');
const deleteCourseMain = require('./../util/courseDeletion/deleteCourseMain');

router.post('/c-api/course/create-new', uploadImage(), async (req, res) => {
    const courseData = JSON.parse(req.body.courseData);
    const title = courseData.title;
    const category = courseData.category;
    let imageUrl = null;
    if (req.file) {
        imageUrl = req.file.key;
    }
    try {
        const newCourse = new Course({
            title: title,
            category: category,
            imageUrl: imageUrl,
            public: true,
            authorName: req.session.user.name,
            authorImageUrl: req.session.user.imageUrl,
            authorId: req.session.user._id,
            popularity: 0,
        });
        const savedCourse = await newCourse.save();
        const user = await User.findById(req.session.user._id);
        user.courses.push(savedCourse._id);
        await user.save();
        res.json({ success: true, courseId: savedCourse._id });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/course/:courseId/add-section', async (req, res) => {
    const courseId = req.params.courseId;
    const title = req.body.sectionTitle;
    try {
        const newSection = new CourseSection({
            title,
            courseId
        })
        const savedSection = await newSection.save();
        const section = await CourseSection.findById(savedSection._id).lean();
        const course = await Course.findById(courseId);
        course.sections.push(String(section._id));
        await course.save()
        res.json({ endpointHit: true });
    } catch (error) {
        console.log(error);
    }
});

router.post(`/c-api/course/:courseId/reorder-sections`, async (req, res) => {
    const courseId = req.params.courseId;
    const newSectionsOrder = req.body;
    try {
        const course = await Course.findById(courseId);
        course.sections = newSectionsOrder;
        await course.save();
        res.json({ updatedSections: true });
    } catch (error) {
        console.log(error);
    }
});

router.patch('/c-api/edit-section-title/:sectionId', async (req, res) => {
    const sectionId = req.params.sectionId;
    const newTitle = req.body.newTitle;
    try {
        const section = await CourseSection.findById(sectionId);
        section.title = newTitle;
        await section.save();
        res.json({ changedTitle: true, courseId: section._id });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/c-api/section/:sectionId', async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
        const section = await CourseSection.findById(sectionId);
        const lessons = section.lessons;
        const courseId = section.courseId;
        for (let l of lessons) {
            let lessonId = l.lessonId
            await deleteLessonInCourse(courseId, lessonId);
            await Text.findByIdAndDelete(lessonId);
            await Quiz.findByIdAndDelete(lessonId);
            const video = await Video.findById(lessonId).lean();
            await Video.findByIdAndDelete(lessonId);
            if (video) {
                await deleteVideo(video.videoUrl);
            }
            const questions = await Question.find({ lessonId: lessonId });
            for (let q of questions) {
                await Question.findByIdAndDelete(String(q._id));
            }
        }
        await CourseSection.findByIdAndDelete(sectionId);
        res.json({ sectionDeleted: true });
    } catch (error) {
        console.log(error);
    }
});

router.patch('/c-api/edit-course/:courseId', uploadImage(), async (req, res) => {
    const courseData = JSON.parse(req.body.title);
    const courseId = req.params.courseId;
    const title = courseData.title;
    try {
        const course = await Course.findById(courseId);
        let imageUrl = course.imageUrl;
        if (req.file) {
            await deleteMedia(imageUrl);
            imageUrl = req.file.key;
        }
        course.title = title;
        course.imageUrl = imageUrl;
        await course.save();
        res.json({ savedChanges: true });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/c-api/course/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.session.user;
    console.log(courseId);
    try {
        deleteCourseMain(courseId, userId);
        res.json({ triedToDelete: true });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;