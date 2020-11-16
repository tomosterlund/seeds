import React, { useState } from 'react'
import SeedButton from '../../../../UI/SeedsButton/SeedButton';
import styles from './AddQuestion.module.css'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Textfield from '../../../../UI/Forms/Textfield/TextfieldFC';
import { PlusCircle, TrashFill } from 'react-bootstrap-icons'
import { Clear } from '@material-ui/icons';
import { isLongerThan } from './../../../../../util/form-validation/validating-strings'
import axios from 'axios'

import Answer from './../../../../../interfaces/LessonInterfaces/AnswerInterface'
import QuestionObject from './../../../../../interfaces/LessonInterfaces/Question'

interface Props {
    lessonId: string;
    closeShowAddQuestion: (lid?: string) => void;
    mode: string;
    questionId?: string;
    questionDoc?: QuestionObject;
}

const AddQuestion: React.FC<Props> = ({ lessonId, closeShowAddQuestion, mode, questionId, questionDoc }) => {
    const [question, setQuestion] = useState(questionDoc ? questionDoc.question : '');
    const [answer1, setAnswer1] = useState(questionDoc ? questionDoc.answers[0].text : 'Answer 1');
    const [answer2, setAnswer2] = useState(questionDoc ? questionDoc.answers[1].text : 'Answer 2');
    const [answer3, setAnswer3] = useState(() => {
        if (questionDoc && questionDoc.answers[2]) {
            return questionDoc.answers[2].text;
        }
        return undefined
    });
    const [answer4, setAnswer4] = useState(() => {
        if (questionDoc && questionDoc.answers[3]) {
            return questionDoc.answers[3].text;
        }
        return undefined
    });
    const [correctAnswer, setCorrectAnswer] = useState('');

    const createQuestionObject = () => {
        const questionObject: QuestionObject = {
            lessonId: lessonId,
            question: question,
            answers: []
        }
        let answers = [answer1, answer2];
        if (answer3) {answers = [answer1, answer2, answer3]}
        if (answer4) {answers = [answer1, answer2, answer3, answer4]}
        for (let a of answers) {
            if (a === correctAnswer) {
                questionObject.answers.push({ text: a, correct: true });
            } else if (a !== correctAnswer) {
                questionObject.answers.push({ text: a, correct: false });
            }
        }
        return questionObject;
    }

    const setQuestionHandler = (event: any) => {
        setQuestion(event.target.value);
    }

    const handleChange = (event: any) => {
        setCorrectAnswer(event.target.value);
    }

    const addAnswerHandler = () => {
        if (!answer3 && !answer4) {return setAnswer3('Answer 3')}
        if (answer3 && !answer4) {return setAnswer4('Answer 4')}
        if (!answer3 && answer4) {return setAnswer3('Answer 3')}
    }

    const postQuestion = async () => {
        const validQuestion = isLongerThan(question, 1);
        if (validQuestion && mode === 'add') { 
            const questionObject = createQuestionObject();
            try {
                const postedQuestion = await axios.post(`/c-api/post-question/${lessonId}`, questionObject);
                console.log(postedQuestion);
                const lid = postedQuestion.data.quizDoc._id
                closeShowAddQuestion(lid);
            } catch (error) {console.log(error)}
        } 

        if (validQuestion && mode === 'edit') {
            const questionObject = createQuestionObject();
            try {
                const editedQuestion = await axios.patch(`/c-api/edit-question/${questionId}`, questionObject);
                console.log(editedQuestion);
                closeShowAddQuestion(lessonId);
            } catch (error) {console.log(error)}
        }
    }

    return<>
        <div className={styles.AddQuestion}>
            <div className={styles.QuestionInputContainer}>
                <h3>{mode.charAt(0).toUpperCase() + mode.slice(1)} question</h3>
                <textarea
                value={question}
                onChange={setQuestionHandler}
                className={styles.Textarea}
                cols={40}
                rows={4}
                />
            </div>

            <FormControl component="fieldset">
                <RadioGroup aria-label="questions" name="Questions" value={correctAnswer} onChange={handleChange}>
                    <div className={styles.AnswerContainer}>
                        <FormControlLabel value={answer1} control={<Radio color="primary" />} label="" />
                        <Textfield
                        inputValue={answer1}
                        placeholder="Enter an answer here"
                        inputType="text"
                        updateState={(event) => setAnswer1(event.target.value)}
                        />
                    </div>

                    <div className={styles.AnswerContainer}>
                        <FormControlLabel value={answer2} control={<Radio color="primary" />} label="" />
                        <Textfield
                        inputValue={answer2}
                        placeholder="Enter an answer here"
                        inputType="text"
                        updateState={(event) => setAnswer2(event.target.value)}
                        />
                    </div>

                    {
                        answer3 !== undefined ? (
                            <div className={styles.AnswerContainer}>
                                <FormControlLabel value={answer3} control={<Radio color="primary" />} label="" />
                                <Textfield
                                inputValue={answer3}
                                placeholder="Enter an answer here"
                                inputType="text"
                                updateState={(event) => setAnswer3(event.target.value)}
                                />
                                {
                                    answer4 === undefined ? (
                                        <div className={styles.ClearIcon} onClick={() => setAnswer3(undefined)}>
                                            <Clear />
                                        </div>
                                    ) : null
                                }
                            </div>
                        ) : null
                    }

                    {
                        answer4 !== undefined ? (
                            <div className={styles.AnswerContainer}>
                                <FormControlLabel value={answer4} control={<Radio color="primary" />} label="" />
                                <Textfield
                                inputValue={answer4}
                                placeholder="Enter an answer here"
                                inputType="text"
                                updateState={(event) => setAnswer4(event.target.value)}
                                />
                                <div className={styles.ClearIcon} onClick={() => setAnswer4(undefined)}>
                                    <Clear />
                                </div>
                            </div>
                        ) : null
                    }
                </RadioGroup>
            </FormControl>
            {
                !answer3 || !answer4 ? (
                    <div onClick={addAnswerHandler} className={styles.AddAnswerOption}>
                        <PlusCircle />
                        <p>Add another answer</p>
                    </div>
                ) : null
            }

            <div className={styles.ButtonsContainer}>
                <SeedButton
                image={false}
                text="Save question"
                click={postQuestion}
                />
                <div onClick={() => closeShowAddQuestion(lessonId)}>
                    <SeedButton
                    image={false}
                    text={mode === 'add' ? 'Discard' : 'Discard changes'}
                    backgroundColor="red">
                        <TrashFill style={{ margin: '0 8px 0 0' }} />
                    </SeedButton>
                </div>
            </div>
        </div>
    </>
}

export default AddQuestion;