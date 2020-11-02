const express = require('express');
const router = express.Router();
const Text = require('./../../Models/lessons/Text');
const Section = require('./../../Models/CourseSection');
const Course = require('./../../Models/Course');
const deleteLessonInCourse = require('./../../util/DBUtil/deleteLessonInCourse');
const deleteLessonInSection = require('./../../util/DBUtil/deleteLessonInSection');

router.post('/c-api/course/:courseId/add-text', async (req, res) => {
    const courseId = req.params.courseId;
    const sectionId = req.body.sectionId;
    const lessonType = 'text';
    const reqBody = req.body;
    const title = reqBody.title;
    const content = reqBody.content;
    const authorId = req.session.user._id;
    const authorName = req.session.user.name;
    const authorImageUrl = req.session.user.imageUrl;
    const views = 0;
    const popularity = 0;
    try {
        // Create text document
        const newText = new Text({
            title,
            content,
            courseId,
            authorId,
            authorName,
            authorImageUrl,
            views,
            popularity
        })
        const postedText = await newText.save();
        const lessonId = postedText._id;

        // Update section
        const section = await Section.findById(sectionId);
        section.lessons.push({ title, lessonId, lessonType });
        await section.save()

        // Update course
        const course = await Course.findById(courseId);
        course.lessonIds.push(String(postedText._id));
        await course.save();

        res.json({ postedText: true });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/delete-text/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    try {
        await Text.findByIdAndDelete(lessonId);
        const section = await deleteLessonInSection(lessonId, sectionId);
        await deleteLessonInCourse(section.courseId, lessonId);
        res.json({ deletedText: true });
    } catch (error) {
        console.log(error);
    }
})

router.post('/c-api/edit-text-title/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    const newTitle = req.body.newTitle;
    try {
        // Changing title
        const updatedText = await Text.findById(lessonId);
        updatedText.title = newTitle;
        await updatedText.save();

        // Updating section
        const section = await Section.findById(sectionId);
        let lessonIndex;
        for (let i = 0; i < section.lessons.length; i++) {
            if (section.lessons[i].lessonId == lessonId) {
                lessonIndex = i;
                break;
            }
        }
        section.lessons.splice(lessonIndex, 1, { title: newTitle, lessonId: lessonId, lessonType: 'text' });
        await section.save();

        // Updating course
        await deleteLessonInCourse(section.courseId, lessonId);

        res.json({ changedTitle: true });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/get-text-content/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const textDocument = await Text.findById(lessonId).lean();
        res.json({ textDocument });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/edit-text/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const editedText = req.body.editedText;
    try {
        const text = await Text.findById(lessonId);
        text.content = editedText;
        await text.save();
        res.json(text);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;