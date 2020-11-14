import React from 'react'
import QuestionInterface from '../../../../../interfaces/LessonInterfaces/Question';
import styles from './Question.module.css'

interface Props {
    question: QuestionInterface;
}

const Question: React.FC<Props> = ({ question }) => {
    return<>
        <div className={styles.Question}>
            <h3>
                {question.question}
            </h3>
            
            {question.answers.map((a, i) => (
                <div className={styles.Answer} key={i}>
                    {a.text}
                </div>
            ))}
        </div>
    </>
}

export default Question;