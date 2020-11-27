import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Interactions.module.css'
import SeedButton from '../../../../UI/SeedsButton/SeedButton';
import Axios from 'axios';
import LessonMessage from './LessonMessage';
import { useSelector } from 'react-redux';
import stateInterface from '../../../../../interfaces/stateInterface';
import courseViewLang from '../../../../../util/language/pages/course-view';
import { CircularProgress } from '@material-ui/core';
import { PlusCircle } from 'react-bootstrap-icons';
import interactionLang from '../../../../../util/language/pages/lesson-interaction';

interface Props {
    courseAuthorId: string;
}

const Interactions: React.FC<Props> = ({ courseAuthorId }) => {
    const router = useRouter();
    const { lessonid } = router.query
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);

    const [fetchedData, setFetchedData] = useState(false);
    const [message, setMessage] = useState('');
    const [lessonMessages, setLessonMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showGetMore, setShowGetMore] = useState(true);

    const submitMessage = async () => {
        setLoading(true);
        try {
            const postedMessage = await Axios.post(`/c-api/lesson-message/${lessonid}`, { message });
            console.log(postedMessage);
            setLessonMessages(postedMessage.data.lessonMessages);
            setMessage('');
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteMessage = async (messageId: string) => {
        try {
            const deletedMessage = await Axios.delete(`/c-api/lesson-message/${messageId}`);
            console.log(deletedMessage);
            setLessonMessages(deletedMessage.data.msgs);
        } catch (error) {
            console.log(error);
        }
    }

    const sendReply = async (replyToMsg: string, replyText: string) => {
        const postReply = await Axios.post(`/c-api/reply-to-message/${replyToMsg}`, {
            content: replyText,
        });
        const msgs = postReply.data.msgs;
        setLessonMessages(msgs);
    }

    const deleteReply = async (replyId: string) => {
        try {
            const msgs = await Axios.post(`/c-api/delete-reply-to-message/${replyId}`, {
                lessonId: lessonid
            });
            setLessonMessages(msgs.data.msgs);
        } catch (error) {
            console.log(error);
        }
    }

    const likeMessage = async (msgId: string) => {
        try {
            const msgs = await Axios.post(`/c-api/like-message/${msgId}`, {
                voterId: sessionUser._id,
                lessonId: lessonid
            });
            setLessonMessages(msgs.data.msgs);
        } catch (error) {
            console.log(error);
        }
    }

    const unlikeMessage = async (msgId: string) => {
        try {
            const msgs = await Axios.post(`/c-api/unlike-message/${msgId}`, {
                voterId: sessionUser._id,
                lessonId: lessonid
            });
            setLessonMessages(msgs.data.msgs);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!fetchedData) {
            console.log('fetching data');
            const fetchMessages = async () => {
                const ms = await Axios.get(`/c-api/lesson-messages/${lessonid}`);
                console.log(ms.data.msgs);
                setLessonMessages(ms.data.msgs);
                setFetchedData(true);
            }
            fetchMessages();
        }
    })

    const getMoreMsgs = async () => {
        const currentLength = lessonMessages.length;
        try {
            const moreMsgs = await Axios.post(`/c-api/more-lesson-messages/${lessonid}`, { currentLength });

            if (moreMsgs.data.noMore) {
                console.log('nore more');
                return setShowGetMore(false);
            }

            console.log(moreMsgs.data.msgs);
            const lsnMsgs = lessonMessages;
            lsnMsgs.push(moreMsgs.data.msgs)
            console.log(lsnMsgs);
            setLessonMessages(lsnMsgs.flat());
        } catch (error) {
            console.log(error);
        }
    }
    
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
                            {!loading ? (
                                <SeedButton
                                    click={submitMessage}
                                    text={courseViewLang[userLang].replyToLesson}
                                    image={false}
                                />
                            ) : <CircularProgress style={{ margin: '0 0 0 32px' }} />}
                        </div>
                </div>
            </div>

            <div className={styles.MessagesContainer}>

            </div>

            {lessonMessages ? lessonMessages.map((lm: any, i: number) => (
                <div key={i}>
                    <LessonMessage
                        courseAuthorId={courseAuthorId}
                        deleteMessage={deleteMessage}
                        key={lessonMessages}
                        message={lm.msg}
                        replies={lm.replies}
                        sendReplyAPI={sendReply}
                        deleteReply={deleteReply}
                        likeMessage={likeMessage}
                        unlikeMessage={unlikeMessage}
                    />
                </div>
            )) : null}

            {lessonMessages.length >= 5 && showGetMore ? (
                <div onClick={getMoreMsgs} className={styles.MoreMessagesOpt}>
                    <PlusCircle style={{ margin: '0 6px 0 0' }} />
                    {interactionLang[userLang].moreComments}
                </div>
            ) : null}


        </div>
    </>
}

export default Interactions;