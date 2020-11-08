import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { showQuizEditor } from './../../../../store/actions/showQuizEditorActions'
import Router from 'next/router'
import styles from './LessonItem.module.css'
import { Movie, Subject, HelpOutline, ExpandMore } from '@material-ui/icons'
import { Check2Circle } from 'react-bootstrap-icons'
import MiniButton from './../../../UI/SeedsButton/MiniButton'
import LessonOptions from './LessonOptions/LessonOptions'
import Backdrop from './../../../UI/Backdrop/Backdrop'
import EditText from './../AddText/EditText'
import axios from 'axios'

interface Props {
    title: string;
    lessonId: string;
    lessonType: 'video' | 'text' | 'quiz';
    courseId: string;
    sectionId: string;
}

const LessonItem: React.FC<Props> = ({ title, lessonType, lessonId, courseId, sectionId }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [titleEditor, toggleTitleEditor] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    //State for editing texts
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [textContent, setTextContent] = useState('');
    const fetchTextContent = async () => {
        try {
            const textDocument = await axios.get(`/c-api/get-text-content/${lessonId}`);
            setTextContent(textDocument.data.textDocument.content)
            setShowTextEditor(true);
            console.log(textContent);
        
        } catch (error) {
            console.log(error);
        }
    }
    const closeTextEditor = () => {
        setShowTextEditor(false);
    }

    // State & method for editing quiz
    const dispatch = useDispatch()
    const fetchQuiz = async () => {
        try {
            dispatch(showQuizEditor(lessonId));
        } catch (error) {
            console.log(error);
        }
    }

    const openLessonEditor = () => {
            toggleTitleEditor(true);
    }

    const editLessonName = async () => {
        const postedNewLessonTitle = await axios.post(`/c-api/edit-${lessonType}-title/${lessonId}`, { newTitle, sectionId });
        console.log(postedNewLessonTitle);
        Router.push(`/course/editor/${courseId}`);
        toggleTitleEditor(false);
    }

    const deleteLesson = async () => {
        try {
            const deletedLesson = await axios.post(`/c-api/delete-${lessonType}/${lessonId}`, { sectionId: sectionId });
            console.log(deletedLesson);
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    }
    
    return<>
        <div className={styles.LessonItem}>
            {lessonType === 'video' ? <Movie fontSize="small" /> : null}
            {lessonType === 'text' ? <Subject fontSize="small" /> : null}
            {lessonType === 'quiz' ? <HelpOutline fontSize="small" /> : null}
            {
                !titleEditor ? <p>{title}</p> : (
                    <div style={{ display: 'flex', width: '70%' }}>
                        <input
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        className={styles.TitleInput}
                        placeholder={title}
                        type="text"
                        />
                        <div onClick={editLessonName}>
                            <MiniButton text="save">
                                <Check2Circle style={{fontSize: '22px', margin: '0 4px 0 0', color: '#2a772d'}} className={styles.CheckIcon} />
                            </MiniButton>
                        </div>
                    </div>
                )
            }
            <div
            className={styles.OptionsContainer}
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
            >
                <ExpandMore />
                <LessonOptions
                lessonType={lessonType}
                showOptions={showOptions}
                deleteLesson={deleteLesson}
                openLessonEditor={openLessonEditor}
                lessonId={lessonId}
                fetchTextContent={fetchTextContent}
                fetchQuiz={fetchQuiz}
                />
            </div>
            <Backdrop show={showTextEditor} toggle={() => setShowTextEditor(false)} />
            <EditText textContent={textContent} lessonId={lessonId} show={showTextEditor} close={closeTextEditor} />
        </div>
    </>
}

export default LessonItem;