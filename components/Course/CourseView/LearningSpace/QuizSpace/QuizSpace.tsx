import { HelpOutline } from '@material-ui/icons';
import React, { useState } from 'react'
import QuizLesson from '../../../../../interfaces/LessonInterfaces/QuizInterface';
import QuestionComp from './Question'
import styles from './QuizSpace.module.css'

interface Props {
    quizData: QuizLesson;
}

const QuizSpace: React.FC<Props> = ({ quizData }) => {

    const [quiz, setQuiz] = useState(quizData.quiz);
    const [questions, setQuestions] = useState(quizData.questions);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const submitAnswer = () => {

        setCurrentQuestion(currentQuestion + 1);
    }

    return<>
        <div className={styles.QuizContainer}>
            <div className={styles.QuizHeader}>
                <HelpOutline style={{ margin: '0 8px 0 0' }} />
                <h2>{quiz.title}</h2>
            </div>
        
            <QuestionComp
                key={currentQuestion}
                question={questions[currentQuestion]}
            />
        </div>
    </>
}

export default QuizSpace;