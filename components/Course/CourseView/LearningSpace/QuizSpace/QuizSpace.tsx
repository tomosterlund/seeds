import { HelpOutline, Replay } from '@material-ui/icons';
import React, { Fragment, useEffect, useState } from 'react'
import QuizLesson from '../../../../../interfaces/LessonInterfaces/QuizInterface';
import SeedButton from '../../../../UI/SeedsButton/SeedButton';
import QuestionComp from './Question'
import QuestionOverview from './QuestionOverview';
import styles from './QuizSpace.module.css'

interface Props {
    quizData: QuizLesson;
}

const QuizSpace: React.FC<Props> = ({ quizData }) => {

    const [quiz, setQuiz] = useState(quizData.quiz);
    const [questions, setQuestions] = useState(quizData.questions);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);
    const [questionsOverview, setQuestionsOverview] = useState(undefined);
    const [finished, setFinished] = useState(false);
    
    useEffect(() => {
        if (questionsOverview === undefined) {
            let newOverviewArr = []
            for (let i = 0; i < questions.length; i++) {
                newOverviewArr.push({
                    qNum: i,
                    state: 'waiting'
                })
            }
            setQuestionsOverview(newOverviewArr);
        }
    })

    const submitAnswer = (correct: boolean) => {
        let newOverViewArr = questionsOverview;
        switch(correct) {
            case true:
                newOverViewArr[currentQuestion].state = 'true';
                setCorrectNum(correctNum + 1);
                break;
            case false:
                newOverViewArr[currentQuestion].state = 'false';
                break;
        }
        setQuestionsOverview(newOverViewArr);
        setCurrentQuestion(currentQuestion + 1);

        if (currentQuestion + 1 === questions.length) {
            setFinished(true);
        }
    }

    const startOver = () => {
        setQuestionsOverview(undefined);
        setCurrentQuestion(0);
        setCorrectNum(0);
        setFinished(false);
    }

    return<>
        <div className={styles.QuizContainer}>
            <div className={styles.QuizHeader}>
                <div className={styles.QuizTitle}>
                    <HelpOutline style={{ margin: '0 8px 0 0' }} />
                    <h2>{quiz.title}</h2>
                </div>
                {
                    questionsOverview ? (
                        <QuestionOverview key={questionsOverview} qOverview={questionsOverview} />
                    ) : null
                }
            </div>

            {!finished ? (
                <QuestionComp
                    key={currentQuestion}
                    question={questions[currentQuestion]}
                    submitAnswer={submitAnswer}
                />
            ) : (
                <Fragment>
                    <div className={styles.FinishedView}>
                        {`Your score: ${correctNum} / ${questions.length}`}
                    </div>
                    <div style={{margin: '0 auto'}}>
                        <SeedButton click={startOver} text="again" image={false}>
                            <Replay fontSize="small" style={{ margin: '0 4px 0 0' }} />
                        </SeedButton>
                    </div>
                </Fragment>
            )}
        
        </div>
    </>
}

export default QuizSpace;