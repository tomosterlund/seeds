const Video = require('./../../Models/lessons/Video');
const Text = require('./../../Models/lessons/Text');
const Quiz = require('./../../Models/lessons/Quiz');
const deleteVideoLesson = require('./deleteVideoLesson');
const deleteTextLesson = require('./deleteTextLesson');
const deleteQuizLesson = require('./deleteQuizLesson');

const deleteLesson = async (lessonId) => {
    try {
        const video = await Video.findById(lessonId).lean();
        const text = await Text.findById(lessonId).lean();
        const quiz = await Quiz.findById(lessonId).lean();

        if (video) {
            deleteVideoLesson(lessonId);
        }

        if (text) {
            deleteTextLesson(lessonId);
        }

        if (quiz) {
            deleteQuizLesson(lessonId);
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteLesson;