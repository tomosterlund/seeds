const Quiz = require('./../../Models/lessons/Quiz');
const Question = require('./../../Models/lessons/Question');

const deleteQuizLesson = async (lessonId) => {
    try {
        await Quiz.findByIdAndDelete(lessonId);
        await Question.deleteMany({ lessonId: lessonId });
        console.log('quiz and questions deleted');
    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteQuizLesson;