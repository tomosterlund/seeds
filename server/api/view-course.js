const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Course = require('./../Models/Course');
const CourseSection = require('./../Models/CourseSection');
const Video = require('./../Models/lessons/Video');
const Text = require('./../Models/lessons/Text');
const Quiz = require('./../Models/lessons/Quiz');
const Question = require('./../Models/lessons/Question');

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
});

router.get('/c-api/my-courses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const myCourses = await Course.find({ authorId: userId }, {
            title: 1,
            imageUrl: 1,
        }).lean();
        console.log(myCourses);
        res.json({ myCourses });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/video-lesson/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const video = await Video.findById(lessonId).lean();
        res.json({ video });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/text-lesson/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const text = await Text.findById(lessonId).lean();
        res.json({ text });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/quiz-lesson/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const quiz = await Quiz.findById(lessonId).lean();
        const questionIds = quiz.questionIds;
        const questions = await Question.find({ _id: [...questionIds] }).lean();
        const quizObject = {
            quiz: quiz,
            questions: questions
        }
        res.json({ quizObject });
    } catch (error) {
        console.log(error);
    }
})

router.get('/c-api/lesson/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    try {
        const video = await Video.findById(lessonId).lean();
        const text = await Text.findById(lessonId).lean();
        const quiz = await Quiz.findById(lessonId).lean();

        if (video) {
            return res.json({ lesson: video });
        }

        if (text) {
            return res.json({ lesson: text });
        }

        if (quiz) {
            const questionIds = quiz.questionIds;
            const questions = await Question.find({ _id: [...questionIds] }).lean();
            return res.json({ lesson: quiz, questions: questions });
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/course/first-lesson/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const course = await Course.findById(courseId).lean();
        const firstSection = await CourseSection.findById(course.sections[0]).lean();
        const firstLesson = firstSection.lessons[0].lessonId;
        console.log(firstLesson);
        res.json({ firstLesson });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;