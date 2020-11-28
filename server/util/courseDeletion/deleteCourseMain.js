const Course = require('./../../Models/Course');
const Section = require('./../../Models/CourseSection');
const User = require('./../../Models/User');
const deleteLesson = require('./deleteLesson');
const deleteMedia = require('./../deleteMedia');

const deleteCourseUtil = async (courseId, userId) => {
    try {
        const course = await Course.findById(courseId).lean();
        const lessons = course.lessonIds;
        for (let l of lessons) {
            deleteLesson(l);
        }
        await Section.deleteMany({ courseId: courseId });
        await Course.findByIdAndDelete(courseId);
        await deleteMedia(course.imageUrl);
        const user = await User.findById(userId);

        let courseIdx;
        for (let i = 0; i < user.courses; i++) {
            if (user.courses[i] == courseId) {
                courseIdx = i;
                console.log('found course %s', user.courses[i]);
            }
        }
        user.courses.splice(courseIdx, 1);
        await user.save();
    } catch (error) {
        console.log(error);
    }
}

module.exports = deleteCourseUtil;