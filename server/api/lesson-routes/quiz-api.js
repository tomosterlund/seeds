const express = require('express');
const router = express.Router();
const Quiz = require('./../../Models/lessons/Quiz');
const Section = require('./../../Models/CourseSection');

router.post('/c-api/create-quiz', async (req, res) => {
    const reqBody = req.body;
    const title = reqBody.title;
    const courseId = reqBody.courseId;
    const sectionId = reqBody.sectionId;
    try {
        // Creating quiz document
        const newQuiz = new Quiz({
            title: title,
            courseId: courseId,
            authorId: req.session.user._id,
            authorName: req.session.user.name,
            authorImageUrl: req.session.user.imageUrl,
            views: 0,
            popularity: 0
        });
        const quizDoc = await newQuiz.save();
        const lessonId= quizDoc._id;

        // Updating course section
        const section = await Section.findById(sectionId);
        section.lessons.push({ title: title, lessonId: lessonId, lessonType: 'quiz' });
        await section.save();

        res.json({ createdQuiz: true, quizDoc: quizDoc });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;