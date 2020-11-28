const Text = require('./../../Models/lessons/Text');

const deleteTextLesson = async (lessonId) => {
    try {
        await Text.findByIdAndDelete(lessonId);
        console.log('deleted text');
    } catch (error) {
        console.log(error);
    }
};

module.exports = deleteTextLesson;