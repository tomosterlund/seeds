import React from 'react'
import styles from './AddLessonOptions.module.css'
import { Movie, Subject, HelpOutline } from '@material-ui/icons'

interface Props {
    addLesson: (lessonType: 'video' | 'text' | 'quiz', sectionId: string) => void;
    sectionId: string;
}

const AddLessonOptions: React.FC<Props> = ({ addLesson, sectionId }) => (
    <div className={styles.AddLesson}>
        <div
        onClick={() => addLesson('video', sectionId)}
        className={styles.AddContainer}
        >
            <Movie />
            <p>Add video lesson</p>
        </div>
        <div
        onClick={() => addLesson('text', sectionId)}
        className={styles.AddContainer}
        >
            <Subject />
            <p>Add text</p>
        </div>
        <div
        onClick={() => addLesson('quiz', sectionId)}
        className={styles.AddContainer}
        >
            <HelpOutline />
            <p>Add quiz</p>
        </div>
    </div>
)

export default AddLessonOptions;