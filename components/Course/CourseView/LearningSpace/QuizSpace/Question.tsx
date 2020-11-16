import React from 'react'
import QuestionInterface from '../../../../../interfaces/LessonInterfaces/Question';
import styles from './Question.module.css'

interface Props {
    question: QuestionInterface;
    submitAnswer: (correct: boolean) => void;
}

const Question: React.FC<Props> = ({ question, submitAnswer }) => {
    return<>
        <div className={styles.Question}>
            <h3>
                {question.question}
            </h3>
            
            {question.answers.map((a, i) => (
                <button
                    className={styles.Answer}
                    key={i}
                    onClick={() => submitAnswer(a.correct)}
                >
                    {a.text}
                </button>
            ))}
        </div>
    </>
}

export default Question;