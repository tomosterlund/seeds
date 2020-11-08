import React, { useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";
import stateInterface from './../../../../interfaces/stateInterface'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import { HelpOutline } from '@material-ui/icons'
import Textfield from './../../../UI/Forms/Textfield/TextfieldFC'
import SeedsButton from './../../../UI/SeedsButton/SeedButton'
import styles from './AddQuiz.module.css'
import { PlusCircle } from 'react-bootstrap-icons'
import AddQuestion from './AddQuestion/AddQuestion'
import QuestionItem from './QuestionItem/QuestionItem'
// import { reorder } from './../../../../util/DND/reorderList'
import axios from 'axios'

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

resetServerContext();

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: '0',
    margin: '0',
    background: isDragging ? "lightgray" : "white",
    ...draggableStyle
});

const AddQuiz: React.FC<Props> = ({ sectionId, courseId, close, show }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDoc, setQuizDoc] = useState({ title: '', questionIds: [], _id: '' }); // Received upon submitting a quiz for the first time
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [showAddQuestion, setShowAddQuestion] = useState(false); // Toggles showing the add question alternative
    const [questionEditorMode, setQuestionEditorMode] = useState('add'); // Toggles between add question and edit question mode
    const lessonId = useSelector((state: stateInterface) => state.showQuizEditor.lessonId);
    const [questionToBeEdited, setQuestionToBeEdited] = useState(''); // ID to be passed in API-call when editing question 
    const [questionDoc, setQuestionDoc] = useState(); // Question Doc fetched from server, in order to edit question

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
        } catch (error) {
            console.log(error);
        }
    }

    const closeAddQuestion = async () => {
        setShowAddQuestion(false);
        try {
            const quizObject = await axios.get(`/c-api/get-quiz/${lessonId}`);
            setQuizDoc(quizObject.data.quizDoc);
            setQuizQuestions(quizObject.data.questions);
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

    const onQuestionDragEnd = async (result: any) => {
        // Setting the new state within the app
        if (!result.destination) { return console.log('same as before'); }
        const newList = reorder(
            quizQuestions,
            result.source.index,
            result.destination.index
        );
        setQuizQuestions(newList);

        // Posting the new order
        let newOrder = [];
        for (let q of newList) {
            newOrder.push(q._id);
        }
        console.log(newOrder);
        // await axios.patch(`/c-api/edit-question-order/${quizDoc._id}`, newOrder);
        // fetchAPIAgain();
    }

    return <>
        <ModalLarge show={show}>
            <div className={styles.HeaderDiv}>
                <h2>{quizDoc.title ? quizDoc.title : 'Add Quiz'}</h2>
                <HelpOutline />
            </div>
            {
                !quizDoc.title ? (
                    <Fragment>
                        <Textfield
                            label="Quiz title"
                            placeholder="Pick a title for your quiz"
                            inputType="text"
                            inputValue={quizTitle}
                            updateState={updateTitleHandler}
                        />
                        <SeedsButton click={submitQuizTitle} text="Done" image={false} />
                    </Fragment>
                ) : (
                        <Fragment>
                            {!showAddQuestion ? (
                                <SeedsButton click={() => setShowAddQuestion(true)} text="Add question" image={false}>
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

                            {quizQuestions.length < 1 && !showAddQuestion ? <p><i>No questions here yet</i></p> : null}
                            <div
                                className={styles.DroppableContainer}
                            >
                                {quizQuestions.map((q, i) => (
                                    <div
                                        className={styles.QuestionItemContainer}
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
                            </div>
                        </Fragment>
                    )
            }
        </ModalLarge>
    </>
}

export default AddQuiz;