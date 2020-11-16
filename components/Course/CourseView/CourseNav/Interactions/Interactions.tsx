import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Interactions.module.css'
import SeedButton from '../../../../UI/SeedsButton/SeedButton';
import Axios from 'axios';
import LessonMessage from './LessonMessage';

const Interactions: React.FC = () => {
    const router = useRouter();
    const { lessonid } = router.query

    const [fetchedData, setFetchedData] = useState(false);
    const [message, setMessage] = useState('');
    const [lessonMessages, setLessonMessages] = useState();

    const submitMessage = async () => {
        try {
            const postedMessage = await Axios.post(`/c-api/lesson-message/${lessonid}`, { message });
            console.log(postedMessage);
            setLessonMessages(postedMessage.data.lessonMessages);

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
                            text="reply to lesson"
                            image={false}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.MessagesContainer}>

            </div>

            {lessonMessages ? lessonMessages.map((lm: any, i: number) => (
                <LessonMessage key={i} message={lm} />
            )) : null}

        </div>
    </>
}

export default Interactions;