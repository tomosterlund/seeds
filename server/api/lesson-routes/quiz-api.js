const express = require('express');
const router = express.Router();
const Quiz = require('./../../Models/lessons/Quiz');
const Section = require('./../../Models/CourseSection');
const Question = require('./../../Models/lessons/Question');
const pushLessonIntoCourse = require('../../util/DBUtil/pushLessonIntoCourse');
const deleteLessonInCourse = require('../../util/DBUtil/deleteLessonInCourse');
const deleteLessonInSection = require('../../util/DBUtil/deleteLessonInSection');

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
            views: 0,
            popularity: 0
        });
        const quizDoc = await newQuiz.save();
        const lessonId = String(quizDoc._id);

        // Updating course section
        const section = await Section.findById(sectionId);
        section.lessons.push({ title: title, lessonId: lessonId, lessonType: 'quiz' });
        await section.save();

        await pushLessonIntoCourse(lessonId, courseId);

        res.json({ createdQuiz: true, quizDoc: quizDoc });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/delete-quiz/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    try {
        await Quiz.findByIdAndDelete(lessonId);
        const section = await deleteLessonInSection(lessonId, sectionId);
        await deleteLessonInCourse(section.courseId, lessonId);
        res.json({ deletedQuiz: true });
    } catch (error) {
        console.log(error);
    }
})

router.post('/c-api/edit-quiz-title/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const sectionId = req.body.sectionId;
    const newTitle = req.body.newTitle;
    try {
        // Changing title
        const updatedQuiz = await Quiz.findById(lessonId);
        updatedQuiz.title = newTitle;
        await updatedQuiz.save();

        // Updating section
        const section = await Section.findById(sectionId);
        let lessonIndex;
        for (let i = 0; i < section.lessons.length; i++) {
            if (section.lessons[i].lessonId == lessonId) {
                lessonIndex = i;
                break;
            }
        }
        section.lessons.splice(lessonIndex, 1, { title: newTitle, lessonId: lessonId, lessonType: 'quiz' });
        await section.save();

        // Updating course
        await deleteLessonInCourse(section.courseId, lessonId);
        res.json({ changedTitle: true });
    } catch (error) {
        console.log(error);
    }
});

router.post('/c-api/post-question/:lessonId', async (req, res) => {
    const questionObject = req.body;
    try {
        const question = new Question({ ...questionObject });
        const savedQuestion = await question.save();
        const quiz = await Quiz.findById(questionObject.lessonId);
        quiz.questionIds.push(String(savedQuestion._id));
        await quiz.save();
        res.json({ postedQuestion: true, quizDoc: quiz });
    } catch (error) {
        console.log(error);
    }
})

router.get('/c-api/get-quiz/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    try {
        const quiz = await Quiz.findById(quizId).lean();
        const questions = await Question.find({ _id: [...quiz.questionIds] });
        res.json({ quizDoc: quiz, questions: questions || [] });
    } catch (error) {
        console.log(error);
    }
});

router.patch('/c-api/edit-question/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    const questionObject = req.body;
    console.log(questionObject);
    console.log(questionId);
    try {
        const question = await Question.findById(questionId);
        question.question = questionObject.question;
        question.answers = questionObject.answers;
        await question.save();
        res.json({ updatedQuestion: true });
    } catch (error) {
        console.log(error);
    }
})

router.delete('/c-api/delete-question/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        const lessonId = deletedQuestion.lessonId;
        const quiz = await Quiz.findById(lessonId);
        let questionIndex = 0;
        for (let i = 0; i < quiz.questionIds.length; i++) {
            if (quiz.questionIds[i] == deletedQuestion._id) {
                questionIndex = i;
                break;
            }
        }
        quiz.questionIds.splice(questionIndex, 1);
        await quiz.save();
        res.json({ deletedQuestion: true });
    } catch (error) {
        console.log(error);
    }
});

router.get('/c-api/get-question/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const question = await Question.findById(questionId).lean();
        res.json({ question: question });
    } catch (error) {
        console.log(error);
    }
})

router.patch('/c-api/edit-question-order/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    const newQuestionOrder = req.body;
    console.log(quizId);
    console.log(newQuestionOrder);
})

module.exports = router;