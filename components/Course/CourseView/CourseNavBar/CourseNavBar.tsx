import React from 'react'
import styles from './CourseNavBar.module.css'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

interface Props {
    courseTitle: string;
    courseImageUrl: string;
}

const CourseNav: React.FC<Props> = ({ courseTitle, courseImageUrl }) => {
    return<>
        <div className={styles.CourseNav}>
            <div className={styles.ArrowIconContainer}>
                <KeyboardArrowLeft />
            </div>
            <div className={styles.CourseDetailsContainer}>
                <div
                    style={{backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${courseImageUrl}')`}}
                    className={styles.CourseImage}
                />
                <p>
                    {courseTitle}
                </p>
            </div>
            <div className={styles.ArrowIconContainer}>
                <KeyboardArrowRight />
            </div>
        </div>
    </>
}

export default CourseNav;