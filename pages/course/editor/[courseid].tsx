import React, { useState } from 'react'
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
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [chosenSectionId, setChosenSectionId] = useState(''); // To be passed as prop to addLessonModal
    
    const closeBackdrop = () => {
        setShowAddVideo(false);
        setShowAddSection(false);
        setShowAddText(false);
        setShowAddQuiz(false);
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
            return setShowAddQuiz(true);
        }
    }

    const onDragEnd = (result) => {
        console.log('wef');
    }

    return<>
        <Layout title="Course editor | Seeds">
            <div className={styles.CourseEditor}>
                <div className={styles.CoursePresentation}>
                    <div className={styles.CourseImage} style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${props.imageUrl}')` }} />
                    <div className={styles.PresentationTexts}>
                        <h2>{props.title}</h2>
                        <p> Created at: {props.creationDate.substring(0, 10)}</p>
                    </div>
                </div>
                <AppButton 
                image={false} 
                text="Add new section"
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

            {/* Modals
            for
            adding lessons */}
            <AddVideo close={() => setShowAddVideo(false)} courseId={props._id} sectionId={chosenSectionId} show={showAddVideo} />
            <AddText close={() => setShowAddText(false)} show={showAddText} courseId={props._id} sectionId={chosenSectionId} />
            <AddQuiz close={() => setShowAddQuiz(false)} show={showAddQuiz} courseId={props._id} sectionId={chosenSectionId} />
            <AddSection close={() => setShowAddSection(false)} show={showAddSection} courseId={props._id} />
            {
                showAddVideo || showAddSection || showAddText || showAddQuiz ? (
                    <Backdrop toggle={closeBackdrop} show={showAddVideo || showAddSection || showAddText || showAddQuiz} />
                ) : null
            }
        </Layout>
    </>
}

export default CourseEditor;