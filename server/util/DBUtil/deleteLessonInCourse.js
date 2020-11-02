const Course = require('./../../Models/Course');

const deleteLessonInCourse = async (courseId, lessonId) => {
    const course = await Course.findById(courseId);
    let lessonIndex;
    for (let i = 0; i < course.lessonIds.length; i++) {
        if (course.lessonIds[i] == lessonId) {
            console.log('Algorithm works');
            lessonIndex = i;
        }
    }
    course.lessonIds.splice(lessonIndex, 1);
    await course.save();
}

module.exports = deleteLessonInCourse;