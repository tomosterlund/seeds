import React, { useState } from 'react'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import Router from 'next/router'
import { HelpOutline } from '@material-ui/icons'
import Textfield from './../../../UI/Forms/Textfield/TextfieldFC'
import SeedsButton from './../../../UI/SeedsButton/SeedButton'
import styles from './AddQuiz.module.css'
import axios from 'axios'

interface Props {
    sectionId: string;
    courseId: string;
    close: () => void;
    show: boolean;
}

const AddQuiz: React.FC<Props> = ({ sectionId, courseId, close, show }) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizId, setQuizId] = useState(); // Received upon submitting a quiz for the first time

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
            Router.push(`/course/editor/${courseId}`);
            close();
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <ModalLarge show={show}>
            <div className={styles.HeaderDiv}>
                <h2>Add Quiz</h2>
                <HelpOutline />
            </div>
            <Textfield
                label="Quiz title"
                placeholder="Pick a title for your quiz"
                inputType="text"
                inputValue={quizTitle}
                updateState={updateTitleHandler}
            />
            <SeedsButton click={submitQuizTitle} text="Done" image={false} />
        </ModalLarge>
    </>
}

export default AddQuiz;