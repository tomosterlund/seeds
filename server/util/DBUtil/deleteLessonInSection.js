const Section = require('./../../Models/CourseSection');

const deleteLessonInSection = async (lessonId, sectionId) => {
    const section = await Section.findById(sectionId);
    let lessonNr = 0;
    for (let i = 0; i < section.lessons.length; i++) {
        if (section.lessons[i].lessonId == lessonId) {
            lessonNr = i;
        }
    }
    section.lessons.splice(lessonNr, 1);
    await section.save();
    return section;
}

module.exports = deleteLessonInSection;