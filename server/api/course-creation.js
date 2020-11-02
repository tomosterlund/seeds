const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./../Models/User');
const Course = require('./../Models/Course');
const CourseSection = require('./../Models/CourseSection');
const uploadImage = require('./../util/uploadImage');

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
})

module.exports = router;