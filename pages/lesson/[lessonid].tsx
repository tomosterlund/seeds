import axios from 'axios'
import { GetServerSideProps } from 'next'
import React, { useState, useEffect } from 'react'
import CourseNav from '../../components/Course/CourseView/CourseNav/CourseNav'
import CourseNavBar from '../../components/Course/CourseView/CourseNavBar/CourseNavBar'
import Layout from '../../components/Layout/Layout'
import courseInterface from '../../interfaces/courseInterface'
import Axios from 'axios'
import styles from './CourseView.module.css'
import LearningSpace from '../../components/Course/CourseView/LearningSpace/LearningSpace'
import Router from 'next/router'

interface Props {
    courseData: courseInterface;
    sections: [];
    lessonType: string;
    videoData: any;
    textData: any;
    quizData: any;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const lessonId = ctx.params.lessonid;
    const getLesson = await axios.get(`http://localhost:3000/c-api/lesson/${lessonId}`);
    const lesson = getLesson.data.lesson;
    const getCourse = await axios.get(`http://localhost:3000/c-api/course/${lesson.courseId}`)
    const courseData = getCourse.data.courseData;
    const sections = getCourse.data.sections;
    
    // Set lesson type
    let lessonType = '';
    let videoData = null;
    let textData = null;
    let quizData = null;

    if (lesson.videoUrl) {
        lessonType = 'video';
        videoData = lesson;
    }

    if (lesson.content) {
        lessonType = 'text';
        textData = lesson;
    }

    if (lesson.questionIds) {
        lessonType = 'quiz';
        quizData = {
            quiz: lesson,
            questions: getLesson.data.questions
        };
    }

    return {
        props: {
            courseData: courseData,
            sections: sections,
            lessonType: lessonType,
            videoData: videoData,
            textData: textData,
            quizData: quizData
        }
    }
}

const CourseView: React.FC<Props> = ({ courseData, sections, lessonType, videoData, textData, quizData }) => {

    const [showLessonType, setShowLessonType] = useState(lessonType);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [videoDataState, setVideoData] = useState(videoData);
    const [textDataState, setTextData] = useState(textData);
    const [quizDataState, setQuizData] = useState(quizData);

    const goToLesson = async (lessonId: string, lessonType: string) => {
        try {

            if (lessonType === 'video') {
                const video = await Axios.get(`/c-api/video-lesson/${lessonId}`);
                setVideoData(video.data.video);
                setShowLessonType('video');
                Router.push(`/lesson/${lessonId}`, undefined, { shallow: true });
            }

            if (lessonType === 'text') {
                const text = await Axios.get(`/c-api/text-lesson/${lessonId}`);
                setTextData(text.data.text);
                setShowLessonType('text');
                Router.push(`/lesson/${lessonId}`, undefined, { shallow: true });
            }

            if (lessonType === 'quiz') {
                const quiz = await Axios.get(`/c-api/quiz-lesson/${lessonId}`);
                setQuizData(quiz.data.quizObject);
                setShowLessonType('quiz');
                Router.push(`/lesson/${lessonId}`, undefined, { shallow: true });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return<>
        <Layout title={courseData.title + ' | Seeds'}>
            <div className={styles.CourseView}>
                {/* <div className={styles.FlexColumn}> */}
                    <CourseNavBar courseImageUrl={courseData.imageUrl} courseTitle={courseData.title}/>

                    <LearningSpace
                        key={currentLessonId}
                        lessonKey={currentLessonId}
                        lessonType={showLessonType}
                        videoData={videoDataState}
                        textData={textDataState}
                        quizData={quizDataState}
                    />

                    <CourseNav goToLesson={goToLesson} sections={sections} />
                </div>
            {/* </div> */}
        </Layout>
    </>
}

export default CourseView;