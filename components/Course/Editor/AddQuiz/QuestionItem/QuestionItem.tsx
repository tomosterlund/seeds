import React, { useState } from 'react'
import ModalMini from './../../../../UI/Modals/ModalMini/ModalMini'
import { ExpandMore, Edit, Delete } from '@material-ui/icons'
import styles from './QuestionItem.module.css'
import listStyles from './../../LessonItem/LessonItem.module.css'
import optionStyles from './../../LessonItem/LessonOptions/LessonOptions.module.css'
import axios from 'axios'

interface Props {
    question: string;
    questionId: string;
    idx: number;
    openQuestionEditor?: (questionId: string) => void;
    fetchAPIAgain: () => void;
}

const QuestionItem: React.FC<Props> = ({ question, idx, questionId, openQuestionEditor, fetchAPIAgain }) => {
    const [showQuestionOptions, setShowQuestionOptions] = useState(false);
    
    const toggleQuestionOptions = () => {
        setShowQuestionOptions(!showQuestionOptions);
    }

    const deleteQuestion = async () => {
        try {
            const deletedPost = await axios.delete(`/c-api/delete-question/${questionId}`);
            console.log(deletedPost);
            fetchAPIAgain();
        } catch (error) {
            console.log(error);
        }
    }
    
    return<>
        <div className={listStyles.LessonItem}>
            {`${idx + 1}. ${question.length < 33 ? question : question.substring(0, 33) + ' ...'}`}
            <div
            onMouseEnter={toggleQuestionOptions}
            onMouseLeave={toggleQuestionOptions}
            className={styles.ExpandMore}
            >
                <ExpandMore />
                <ModalMini show={showQuestionOptions}>
                    <div onClick={() => openQuestionEditor(questionId)} className={optionStyles.ModalListItem}>
                        <Edit />
                        <p>Edit question</p>
                    </div>
                    <div onClick={deleteQuestion} className={optionStyles.ModalListItem}>
                        <Delete />
                        <p>Delete question</p>
                    </div>
                </ModalMini>
            </div>
        </div>
    </>
}

export default QuestionItem;