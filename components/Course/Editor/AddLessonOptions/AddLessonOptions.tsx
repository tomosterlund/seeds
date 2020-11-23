import React from 'react'
import styles from './AddLessonOptions.module.css'
import { Movie, Subject, HelpOutline } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../interfaces/stateInterface'
import courseEditorLang from '../../../../util/language/pages/course-editor'

interface Props {
    addLesson: (lessonType: 'video' | 'text' | 'quiz', sectionId: string) => void;
    sectionId: string;
}

const AddLessonOptions: React.FC<Props> = ({ addLesson, sectionId }) => {
    
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    return <>
        <div className={styles.AddLesson}>
            <div
            onClick={() => addLesson('video', sectionId)}
            className={styles.AddContainer}
            >
                <Movie />
                <p>{courseEditorLang[userLang].addVideoOpt}</p>
            </div>
            <div
            onClick={() => addLesson('text', sectionId)}
            className={styles.AddContainer}
            >
                <Subject />
                <p>{courseEditorLang[userLang].addTextOpt}</p>
            </div>
            <div
            onClick={() => addLesson('quiz', sectionId)}
            className={styles.AddContainer}
            >
                <HelpOutline />
                <p>{courseEditorLang[userLang].addQuizOpt}</p>
            </div>
        </div>
    </>
}

export default AddLessonOptions;