import React, { useState, useRef, useEffect } from 'react'
import TextLesson from '../../../../interfaces/LessonInterfaces/LessonInterface';
import QuizLesson from '../../../../interfaces/LessonInterfaces/QuizInterface';
import VideoLesson from '../../../../interfaces/LessonInterfaces/VideoInterface';
import styles from './LearningSpace.module.css'
import QuizSpace from './QuizSpace/QuizSpace';
import TextSpace from './TextSpace/TextSpace';
import VideoSpace from './VideoSpace/VideoSpace';

interface Props {
    lessonType: string;
    videoData: VideoLesson;
    textData: TextLesson;
    quizData: QuizLesson;
    lessonKey: string;
}

const prevState = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current
} 

const LearningSpace: React.FC<Props> = ({ lessonType, videoData, lessonKey, textData, quizData }) => {

    const [videoDataState, setVideoDataState] = useState(videoData);
    const [textDataState, setTextDataState] = useState(textData);
    const [quizDataState, setQuizDataState] = useState(quizData);

    const previousVideo = prevState(videoData);
    const previousText = prevState(textData);
    const previousQuiz = prevState(quizData);

    useEffect(() => {
        if (previousVideo !== videoData) {
            setVideoDataState(videoData);
        }

        if (previousText !== textData) {
            setTextDataState(textData);
        }

        if (previousQuiz !== quizData) {
            setQuizDataState(quizData);
        }
    })

    return<>
        <div className={styles.LearningSpace}>
            {lessonType === 'video' ? <VideoSpace key={lessonKey} videoData={videoDataState} /> : null}
            {lessonType === 'text' ? <TextSpace key={lessonKey} textData={textDataState} /> : null}
            {lessonType === 'quiz' ? <QuizSpace key={lessonKey} quizData={quizDataState} /> : null}
        </div>  
    </>
}

export default LearningSpace;