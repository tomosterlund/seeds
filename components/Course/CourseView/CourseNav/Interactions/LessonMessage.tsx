import { Chat, Delete, MoreHoriz, ThumbDownAlt, ThumbUpAlt } from '@material-ui/icons'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../../interfaces/stateInterface'
import ModalMini from '../../../../UI/Modals/ModalMini/ModalMini'
import styles from './LessonMessage.module.css'
import moreStyles from './../../../Editor/LessonItem/LessonOptions/LessonOptions.module.css'
import SeedButton from '../../../../UI/SeedsButton/SeedButton'
import { CircularProgress } from '@material-ui/core'
import MsgReply from './MsgReply'
import replyInterface from '../../../../../interfaces/interaction/replyInterface'

interface messageInterface {
    content: string;
    lessonId: string;
    authorName: string;
    authorId: string;
    authorImageUrl: string;
    popularity: number;
    voters: string[];
    _id: string;
    createdAt: string;
}

interface Props {
    message: messageInterface;
    replies: replyInterface[];
    deleteMessage: (messageId: string) => void;
    courseAuthorId: string;
    sendReplyAPI: (replyToMsg: string, replyText: string) => void;
    deleteReply: (replyId: string) => void;
    likeMessage: (msgId: string) => void;
    unlikeMessage: (msgId: string) => void;
}

const LessonMessage: React.FC<Props> = ({ message, deleteMessage, courseAuthorId, replies, sendReplyAPI, deleteReply, likeMessage, unlikeMessage }) => {
    const sessionUserId = useSelector((state: stateInterface ) => state.sessionReducer.sessionUser._id);
    const [messageOptions, setMessageOptions] = useState(false);
    const [showTextfield, setShowTextfield] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [votedAlready, setVotedAlready] = useState(false);
    const [unlikeModal, setUnlikeModal] = useState(false);

    const DateFormat = (str: string) => {
        const monthNr = str.substring(5, 7);
        const year = str.substring(0, 4);
        const dateNr = str.substring(8, 10);
        const monthsArr = ['nil', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthsArr[monthNr]} ${dateNr}, ${year}`
    }

    const sendResponse = async () => {
        setLoading(true);
        try {
            sendReplyAPI(message._id, replyText);
            setLoading(false);
            setReplyText('');
            setShowTextfield(false);
        } catch (error) {
            console.log(error);
        }
    }

    const unlike = () => {
        setVotedAlready(false);
        unlikeMessage(message._id);
    }

    useEffect(() => {
        for (let id of message.voters) {
            if (id == sessionUserId) {
                setVotedAlready(true);
            }
        }
    })
    
    return<>
        <div className={styles.LessonMessage}>
            <div
                className={styles.AuthorImage}
                style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${message.authorImageUrl}')` }}
            />
            <div className={styles.MessageBody}>
                <div className={styles.MessageHeader}>
                    <h4>{message.authorName}</h4>
                    {
                        sessionUserId === message.authorId || sessionUserId === courseAuthorId ? (
                            <div onClick={() => setMessageOptions(true)} className={styles.MoreIcon}>
                                <MoreHoriz fontSize="small" />
                            </div>
                        ) : null
                    }
                </div>
                <p className={styles.TimeStamp}>
                    {DateFormat(message.createdAt)}
                </p>
                {message.content}

                <div className={styles.InteractionOpts}>
                    <button onClick={() => setShowTextfield(true)}>
                        <Chat fontSize="small" />
                    </button>

                    {!votedAlready ? (
                        <button onClick={() => likeMessage(message._id)}>
                            <ThumbUpAlt style={{ margin: '0 6px 0 0' }} fontSize="small" />
                            <span style={{ fontWeight: 'bold' }}>{message.popularity}</span>
                        </button>
                    ) : (
                        <button onMouseLeave={() => setUnlikeModal(false)} onMouseOver={() => setUnlikeModal(true)}>
                            <ThumbUpAlt style={{ margin: '0 6px 0 0', color: 'blue' }} fontSize="small" />
                            <span style={{ fontWeight: 'bold' }}>{message.popularity}</span>
                            <ModalMini show={unlikeModal} position="left">
                                <div onClick={unlike} className={moreStyles.ModalListItem}>
                                    <ThumbDownAlt style={{ margin: '0 6px 0 0' }} fontSize="small" />
                                    Undo like
                                </div>
                            </ModalMini>
                        </button>
                    )}
                </div>

                {showTextfield ? (
                    <Fragment>
                        <textarea
                            cols={33}
                            rows={3}
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                        />

                        {!loading ? (
                            <div style={{margin: '-16px 0 0 -16px'}}>
                                <SeedButton
                                    click={sendResponse}
                                    image={false}
                                    text="antworten"
                                />
                            </div>
                        ) : <CircularProgress style={{ margin: '32px 0 0 0' }} />}
                    </Fragment>
                ) : null}
                
                {replies ? (
                    <Fragment>
                        {replies.map((r: replyInterface, i: number) => (
                            <MsgReply 
                                authorId={r.authorId}
                                authorImageUrl={r.authorImageUrl}
                                authorName={r.authorName}
                                content={r.content}
                                _id={r._id}
                                key={i}
                                deleteReply={deleteReply}
                            />
                        ))}
                    </Fragment>
                ) : null}

                {/* Message options */}
                <div
                    className={styles.MessageOptions}
                    onMouseLeave={() => setMessageOptions(false)}
                >
                    <ModalMini
                        show={messageOptions}
                        position="right"
                    >
                        <div
                            className={moreStyles.ModalListItem}
                            onClick={() => deleteMessage(message._id)}
                        >
                            <Delete />
                            Delete message
                        </div>

                    </ModalMini>
                </div>
            </div>
        </div>
    </>
}

export default LessonMessage;