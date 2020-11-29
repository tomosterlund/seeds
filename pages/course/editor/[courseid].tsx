import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showQuizEditor, hideQuizEditor } from './../../../store/actions/showQuizEditorActions'
import stateInterface from './../../../interfaces/stateInterface'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import styles from './CourseEditor.module.css'
import Layout from '../../../components/Layout/Layout'
import axios from 'axios'
import CourseInterface from './../../../interfaces/courseInterface'
import AddVideo from './../../../components/Course/Editor/AddVideo/AddVideo'
import AddText from './../../../components/Course/Editor/AddText/AddText'
import AddQuiz from './../../../components/Course/Editor/AddQuiz/AddQuiz'
import AddSection from './../../../components/Course/Editor/AddSection/AddSection'
import Backdrop from './../../../components/UI/Backdrop/Backdrop'
import AppButton from './../../../components/UI/SeedsButton/SeedButton'
import { PlusCircle } from 'react-bootstrap-icons'
import Sections from './../../../components/Course/Editor/Sections/Sections'
import FloatingButton from '../../../components/UI/FloatingButton/FloatingButton'
import { Build } from '@material-ui/icons'
import CourseSettings from '../../../components/Course/Editor/CourseSettings/CourseSettings'
import courseEditorLang from '../../../util/language/pages/course-editor'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const courseId = context.params.courseid;
    const course = await axios.get(`http://localhost:3000/c-api/course/${courseId}`);
    const courseData = course.data.courseData;
    const courseSections = course.data.sections;

    return { props: {
        sections: courseSections,
        lessonIds: courseData.lessonIds,
        subscribers: courseData.subscribers,
        creationDate: courseData.creationDate,
        _id: courseData._id,
        title: courseData.title,
        category: courseData.category,
        imageUrl: courseData.imageUrl,
        isPublic: courseData.public,
        authorName: courseData.authorName,
        authorImageUrl: courseData.authorImageUrl,
        authorId: courseData.authorId,
        popularity: courseData.popularity,
        sectionIds: courseData.sections
    } }
}

const CourseEditor: React.FC<CourseInterface> = (props) => {
    const [showAddSection, setShowAddSection] = useState(false);
    const [showAddVideo, setShowAddVideo] = useState(false);
    const [showAddText, setShowAddText] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const showAddQuiz = useSelector((state: stateInterface) => state.showQuizEditor.showQuizEditor);
    const [chosenSectionId, setChosenSectionId] = useState(''); // To be passed as prop to addLessonModal;
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language)
    
    const dispatch = useDispatch();
    const closeBackdrop = () => {
        setShowAddVideo(false);
        setShowAddSection(false);
        setShowAddText(false);
        setShowSettings(false);
        dispatch(hideQuizEditor());
    }

    const openAddLesson = (lessonType: string, sectionId: string) => {
        setChosenSectionId(sectionId);
        if (lessonType === 'video') {
            Router.push(`/course/editor/${props._id}`, `/course/editor/${props._id}/?add-video`, { shallow: true });
            return setShowAddVideo(true);
        }

        if (lessonType === 'text') {
            Router.push(`/course/editor/${props._id}`, `/course/editor/${props._id}/?add-text`, { shallow: true });
            return setShowAddText(true);
        }

        if (lessonType === 'quiz') {
            return dispatch(showQuizEditor(''));
        }
    }

    return<>
        <Layout title={courseEditorLang[userLang].pageTitle}>
            <div className={styles.CourseEditor}>
                <div className={styles.CoursePresentation}>
                    <div className={styles.CourseImage} style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${props.imageUrl}')` }} />
                    <div className={styles.PresentationTexts}>
                        <h2>{props.title}</h2>
                        <p>{courseEditorLang[userLang].createdAt}: {props.creationDate.substring(0, 10)}</p>
                    </div>
                </div>
                <AppButton 
                image={false} 
                text={courseEditorLang[userLang].addSection}
                click={() => setShowAddSection(true)}
                >
                    <PlusCircle style={{ margin: '0 6px 0 0' }} />
                </AppButton>
                            <Sections
                            courseId={props._id}
                            openAddLesson={openAddLesson}
                            sections={props.sections}
                            sectionIds={props.sectionIds}
                            />
            </div>

            {/* Modals for opening add-lesson alternatives  */}
            <AddVideo close={() => setShowAddVideo(false)} courseId={props._id} sectionId={chosenSectionId} show={showAddVideo} />
            <AddText close={() => setShowAddText(false)} show={showAddText} courseId={props._id} sectionId={chosenSectionId} />
            <AddQuiz close={() => dispatch(hideQuizEditor())} show={showAddQuiz} courseId={props._id} sectionId={chosenSectionId} />
            <AddSection close={() => setShowAddSection(false)} show={showAddSection} courseId={props._id} />
            <CourseSettings close={() => setShowSettings(false)} show={showSettings} courseId={props._id} title={props.title} />
            {
                showAddVideo || showAddSection || showAddText || showAddQuiz || showSettings ? (
                    <Backdrop toggle={closeBackdrop} show={showAddVideo || showAddSection || showAddText || showAddQuiz || showSettings} />
                ) : null
            }
            <FloatingButton click={() => setShowSettings(true)} backgroundColor="#13aa52">
                <Build />
            </FloatingButton>
        </Layout>
    </>
}

export default CourseEditor;