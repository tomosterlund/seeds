import React from 'react'
import styles from './CourseNav.module.css'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

interface Props {
    courseTitle: String;
}

const CourseNav: React.FC<Props> = ({ courseTitle }) => {
    return<>
        <div className={styles.CourseNav}>
            <div className={styles.ArrowIconContainer}>
                <KeyboardArrowLeft />
            </div>
            <p>
                {courseTitle}
            </p>
            <div className={styles.ArrowIconContainer}>
                <KeyboardArrowRight />
            </div>
        </div>
    </>
}

export default CourseNav;