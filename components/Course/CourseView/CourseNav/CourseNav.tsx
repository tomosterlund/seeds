import React, { useState } from 'react'
import styles from './CourseNav.module.css'
import CourseNavOptions from './CourseNavOptions/CourseNavOptions'
import Interactions from './Interactions/Interactions';
import NavLessons from './NavLessons/NavLessons';

interface Props {
    sections: [],
    goToLesson: (lessonId: string, lessonType: string) => void;
    courseAuthorId: string;
}

const CourseNav: React.FC<Props> = ({ sections, goToLesson, courseAuthorId }) => {
    const [chosenOption, setChosenOption] = useState('lessons');

    return<>
        <div className={styles.CourseNav}>
            <CourseNavOptions activeOption={chosenOption} pickNavOption={setChosenOption} />
            
            {chosenOption === 'lessons' ? (
                <NavLessons goToLesson={goToLesson} sections={sections} />
            ) : null}

            {chosenOption === 'chat' ? (
                <Interactions courseAuthorId={courseAuthorId} />
            ) : null}
        </div>
    </>
}

export default CourseNav;