const Course = require('./../../Models/Course');

const pushLessonIntoCourse = async (lessonId, courseId) => {
    try {
        const course = await Course.findById(courseId);
        course.lessonIds.push(lessonId);
        (await course).save()
    } catch (error) {
        console.log(error);
    }
}

module.exports = pushLessonIntoCourse;