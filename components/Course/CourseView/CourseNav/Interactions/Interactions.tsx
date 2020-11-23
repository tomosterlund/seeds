import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Interactions.module.css'
import SeedButton from '../../../../UI/SeedsButton/SeedButton';
import Axios from 'axios';
import LessonMessage from './LessonMessage';
import { useSelector } from 'react-redux';
import stateInterface from '../../../../../interfaces/stateInterface';
import courseViewLang from '../../../../../util/language/pages/course-view';

interface Props {
    courseAuthorId: string;
}

const Interactions: React.FC<Props> = ({ courseAuthorId }) => {
    const router = useRouter();
    const { lessonid } = router.query
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    const [fetchedData, setFetchedData] = useState(false);
    const [message, setMessage] = useState('');
    const [lessonMessages, setLessonMessages] = useState();

    const submitMessage = async () => {
        try {
            const postedMessage = await Axios.post(`/c-api/lesson-message/${lessonid}`, { message });
            console.log(postedMessage);
            setLessonMessages(postedMessage.data.lessonMessages);
            setMessage('');
        } catch (error) {
            console.log(error);
        }
    }

    const deleteMessage = async (messageId: string) => {
        try {
            const deletedMessage = await Axios.delete(`/c-api/lesson-message/${messageId}`);
            console.log(deletedMessage);
            setLessonMessages(deletedMessage.data.lessonMessages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!fetchedData) {
            console.log('fetching data');
            const fetchMessages = async () => {
                const ms = await Axios.get(`/c-api/lesson-messages/${lessonid}`);
                setLessonMessages(ms.data.lessonMessages);
                setFetchedData(true);
            }
            fetchMessages();
        }
    })
    
    return<>
        <div className={styles.Interactions}>
            <div className={styles.CreateComment}>
                <div className={styles.TextareaContainer}>
                    <textarea
                        cols={45}
                        rows={3}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                    <div className={styles.TextareaButton}>
                        <SeedButton
                            click={submitMessage}
                            text={courseViewLang[userLang].replyToLesson}
                            image={false}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.MessagesContainer}>

            </div>

            {lessonMessages ? lessonMessages.map((lm: any, i: number) => (
                <LessonMessage courseAuthorId={courseAuthorId} deleteMessage={deleteMessage} key={i} message={lm} />
            )) : null}

        </div>
    </>
}

export default Interactions;