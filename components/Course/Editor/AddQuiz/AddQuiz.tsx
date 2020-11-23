import React, { useState, Fragment, useEffect, useRef } from 'react'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import stateInterface from './../../../../interfaces/stateInterface'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import { HelpOutline } from '@material-ui/icons'
import Textfield from './../../../UI/Forms/Textfield/TextfieldFC'
import SeedsButton from './../../../UI/SeedsButton/SeedButton'
import styles from './AddQuiz.module.css'
import { PlusCircle } from 'react-bootstrap-icons'
import AddQuestion from './AddQuestion/AddQuestion'
import QuestionItem from './QuestionItem/QuestionItem'
import axios from 'axios'
import courseEditorLang from '../../../../util/language/pages/course-editor'

const reorder = (list, startIndex, endIndex): any => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

interface Props {
    sectionId: string;
    courseId: string;
    close: () => void;
    show: boolean;
}

const AddQuiz: React.FC<Props> = ({ sectionId, courseId, close, show }) => {
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDoc, setQuizDoc] = useState({ title: '', questionIds: [], _id: '' }); // Received upon submitting a quiz for the first time
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [showAddQuestion, setShowAddQuestion] = useState(false); // Toggles showing the add question alternative
    const [questionEditorMode, setQuestionEditorMode] = useState('add'); // Toggles between add question and edit question mode
    let lessonId = useSelector((state: stateInterface) => state.showQuizEditor.lessonId);
    const [questionToBeEdited, setQuestionToBeEdited] = useState(''); // ID to be passed in API-call when editing question 
    const [questionDoc, setQuestionDoc] = useState(); // Question Doc fetched from server, in order to edit question

    const prevState = usePrevious(lessonId);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const getQuizDoc = await axios.get(`/c-api/get-quiz/${lessonId}`);
                console.log('Ran use effect hook');
                setQuizDoc(getQuizDoc.data.quizDoc);
                setQuizQuestions(getQuizDoc.data.questions);
            } catch (error) {
                console.log(error);
            }
        }
        if (!quizDoc.title && lessonId) { fetchQuizData() }

        if (lessonId !== prevState) {
            fetchAPIAgain();
        }

        if (!lessonId && lessonId !== prevState) {
            setQuizDoc({ title: '', questionIds: [], _id: '' });
            setQuizQuestions([]);
        }
    })

    const fetchAPIAgain = async () => {
        try {
            const getQuizDoc = await axios.get(`/c-api/get-quiz/${lessonId}`);
            console.log('Ran use effect hook');
            setQuizDoc(getQuizDoc.data.quizDoc);
            setQuizQuestions(getQuizDoc.data.questions);
        } catch (error) {
            console.log(error);
        }
    }

    const updateTitleHandler = (event: any) => {
        setQuizTitle(event.target.value);
    }

    const submitQuizTitle = async () => {
        const quizData = {
            sectionId: sectionId,
            courseId: courseId,
            title: quizTitle
        }
        try {
            const createdQuizDoc = await axios.post(`/c-api/create-quiz`, quizData);
            console.log(createdQuizDoc);
            setQuizDoc(createdQuizDoc.data.quizDoc);
            Router.push(`/course/editor/${courseId}`)
        } catch (error) {
            console.log(error);
        }
    }

    const closeAddQuestion = async (lid: string) => {
        const getQuizDoc = await axios.get(`/c-api/get-quiz/${lid}`);
        setQuizDoc(getQuizDoc.data.quizDoc);
        setQuizQuestions(getQuizDoc.data.questions);
        setShowAddQuestion(false);
        try {
            await fetchAPIAgain();
            setQuestionEditorMode('add');
            setQuestionDoc(null);
        } catch (error) {
            console.log(error);
        }
    }

    const openQuestionEditor = async (questionId: string) => {
        setQuestionToBeEdited(questionId);
        try {
            const question = await axios.get(`/c-api/get-question/${questionId}`);
            const questionDoc = question.data.question;
            console.log(questionDoc);
            setQuestionDoc(questionDoc);
            setShowAddQuestion(true);
            setQuestionEditorMode('edit');
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <ModalLarge show={show}>
            <div className={styles.HeaderDiv}>
                <h2>{quizDoc.title ? quizDoc.title : courseEditorLang[userLang].addQuizHeader}</h2>
                <HelpOutline />
            </div>
            {
                !quizDoc.title ? (
                    <Fragment>
                        <Textfield
                            label={courseEditorLang[userLang].quizTitleInput}
                            placeholder={courseEditorLang[userLang].quizTitlePh}
                            inputType="text"
                            inputValue={quizTitle}
                            updateState={updateTitleHandler}
                        />
                        <SeedsButton click={submitQuizTitle} text={courseEditorLang[userLang].quizDoneBtn} image={false} />
                    </Fragment>
                ) : (
                        <Fragment>
                            {!showAddQuestion ? (
                                <SeedsButton click={() => setShowAddQuestion(true)} text={courseEditorLang[userLang].addQuestionBtn} image={false}>
                                    <PlusCircle style={{ margin: '0 8px 0 0' }} />
                                </SeedsButton>
                            ) : null}

                            {/* ADD QUESTION COMPONENT */}
                            {showAddQuestion ? (
                                <AddQuestion
                                    mode={questionEditorMode}
                                    closeShowAddQuestion={closeAddQuestion}
                                    lessonId={lessonId || quizDoc._id}
                                    questionId={questionToBeEdited}
                                    questionDoc={questionDoc}
                                />
                            ) : null}

                            {quizQuestions.length < 1 && !showAddQuestion ? <p><i>{courseEditorLang[userLang].noQuestionsyet}</i></p> : null}
                            <div
                                className={styles.DroppableContainer}
                            >
                                {quizQuestions.map((q, i) => (
                                    <div
                                        className={styles.QuestionItemContainer}
                                        key={i}
                                    >
                                        <QuestionItem
                                            idx={i}
                                            question={q.question}
                                            questionId={q._id}
                                            fetchAPIAgain={fetchAPIAgain}
                                            openQuestionEditor={openQuestionEditor}
                                        />
                                    </div>
                                ))}
                                <div style={{ margin: '0 0 30px' }}></div>
                            </div>
                        </Fragment>
                    )
            }
        </ModalLarge>
    </>
}

function usePrevious(lessonId: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = lessonId;
    });
    return ref.current;
}

export default AddQuiz;