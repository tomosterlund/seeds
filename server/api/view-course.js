const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Course = require('./../Models/Course');
const CourseSection = require('./../Models/CourseSection');

router.get('/c-api/course/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const courseData = await Course.findById(courseId).lean();
        const unorderedSections = await CourseSection.find({ _id: [...courseData.sections] }).lean();
        let sections = [];
        for (let sid of courseData.sections) {
            for (let s of unorderedSections) {
                if (sid == s._id) {
                    sections.push(s);
                }
            }
        }
        res.json({ courseData, sections });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;