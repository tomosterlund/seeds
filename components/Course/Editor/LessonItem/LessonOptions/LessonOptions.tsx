import React, { useState } from 'react'
import styles from './LessonOptions.module.css'
import ModalMini from './../../../../UI/Modals/ModalMini/ModalMini'
import { Title, Delete, Edit } from '@material-ui/icons'

interface Props {
    showOptions: boolean;
    openLessonEditor: () => void;
    deleteLesson: () => void;
    lessonType: 'text' | 'video' | 'quiz';
    lessonId: string;
    fetchTextContent: () => void;
}

const LessonOptions: React.FC<Props> = ({ showOptions, openLessonEditor, deleteLesson, lessonType, lessonId, fetchTextContent }) => {
    return <>
        <ModalMini
            show={showOptions}
        >
            {lessonType === 'text' ? (
                <div onClick={fetchTextContent} className={styles.ModalListItem}>
                    <Edit />
                    <p>Edit text</p>
                </div>
            ) : null}
            <div onClick={openLessonEditor} className={styles.ModalListItem}>
                <Title />
                <p>Change title</p>
            </div>
            <div onClick={deleteLesson} className={styles.ModalListItem}>
                <Delete />
                <p>Delete lesson</p>
            </div>
            
        </ModalMini>
    </>
}

export default LessonOptions;