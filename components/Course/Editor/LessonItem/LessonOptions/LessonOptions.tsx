import React from 'react'
import styles from './LessonOptions.module.css'
import ModalMini from './../../../../UI/Modals/ModalMini/ModalMini'
import { Title, Delete, Edit } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../../interfaces/stateInterface'
import courseEditorLang from '../../../../../util/language/pages/course-editor'

interface Props {
    showOptions: boolean;
    openLessonEditor: () => void;
    deleteLesson: () => void;
    lessonType: 'text' | 'video' | 'quiz';
    lessonId: string;
    fetchTextContent: () => void;
    fetchQuiz: () => void;
}

const LessonOptions: React.FC<Props> = ({ showOptions, openLessonEditor, deleteLesson, lessonType, lessonId, fetchTextContent, fetchQuiz }) => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    return <>
        <ModalMini
            show={showOptions}
            position="right"
        >
            {lessonType === 'text' ? (
                <div onClick={fetchTextContent} className={styles.ModalListItem}>
                    <Edit />
                    <p>{courseEditorLang[userLang].editTextOpt}</p>
                </div>
            ) : null}
            {lessonType === 'quiz' ? (
                <div onClick={fetchQuiz} className={styles.ModalListItem}>
                    <Edit />
                    <p>{courseEditorLang[userLang].editQuizOpt}</p>
                </div>
            ) : null}
            <div onClick={openLessonEditor} className={styles.ModalListItem}>
                <Title />
                <p>{courseEditorLang[userLang].changeTitle}</p>
            </div>
            <div onClick={deleteLesson} className={styles.ModalListItem}>
                <Delete />
                <p>{courseEditorLang[userLang].deleteLesson}</p>
            </div>
            
        </ModalMini>
    </>
}

export default LessonOptions;