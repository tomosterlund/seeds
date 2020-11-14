import React, { useState } from 'react'
import styles from './CourseNav.module.css'
import CourseNavOptions from './CourseNavOptions/CourseNavOptions'
import NavLessons from './NavLessons/NavLessons';

interface Props {
    sections: [],
    goToLesson: (lessonId: string, lessonType: string) => void;
}

const CourseNav: React.FC<Props> = ({ sections, goToLesson }) => {
    const [chosenOption, setChosenOption] = useState('lessons');

    return<>
        <div className={styles.CourseNav}>
            <CourseNavOptions activeOption={chosenOption} pickNavOption={setChosenOption} />
            
            {chosenOption === 'lessons' ? (
                <NavLessons goToLesson={goToLesson} sections={sections} />
            ) : null}
        </div>
    </>
}

export default CourseNav;