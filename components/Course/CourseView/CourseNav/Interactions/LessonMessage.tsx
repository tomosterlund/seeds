import { Chat, Delete, ExpandLess, ExpandMore, MoreHoriz, ThumbDownAlt, ThumbUpAlt } from '@material-ui/icons'
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
import DateFormat from '../../../../../util/dates/date-tag'
import interactionLang from '../../../../../util/language/pages/lesson-interaction'

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
    const [votedNow, setVotedNow] = useState(false);
    const [unlikeModal, setUnlikeModal] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

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
        setVotedNow(true);
        setVotedAlready(false);
        unlikeMessage(message._id);
    }

    const like = () => {
        setVotedNow(true);
        setVotedAlready(true);
        likeMessage(message._id)
    }

    useEffect(() => {
        if (!votedNow) {
            for (let id of message.voters) {
                if (id == sessionUserId) {
                    setVotedAlready(true);
                }
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
                        <button onClick={like}>
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
                                    {interactionLang[userLang].undoLike}
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
                            <div style={{margin: '-16px 0 0 -16px', display: 'flex', alignItems: 'center'}}>
                                <SeedButton
                                    click={sendResponse}
                                    image={false}
                                    text={interactionLang[userLang].answer}
                                />

                                <SeedButton
                                    click={() => setShowTextfield(false)}
                                    image={false}
                                    text={interactionLang[userLang].cancel}
                                    backgroundColor="red"
                                />
                            </div>
                        ) : <CircularProgress style={{ margin: '32px 0 0 0' }} />}
                    </Fragment>
                ) : null}
                
                {replies.length > 0 ? (
                    !showReplies ? (
                        <button onClick={() => setShowReplies(true)} className={styles.ShowRepliesButton}>
                            <ExpandMore fontSize="small" />
                            {interactionLang[userLang].showReplies}
                        </button>
                    ) : (
                        <Fragment>
                            <button onClick={() => setShowReplies(false)} className={styles.ShowRepliesButton}>
                                <ExpandLess fontSize="small" />
                                {interactionLang[userLang].hideReplies}
                            </button>
                            {replies.map((r: replyInterface, i: number) => (
                                <MsgReply 
                                    authorId={r.authorId}
                                    authorImageUrl={r.authorImageUrl}
                                    authorName={r.authorName}
                                    content={r.content}
                                    _id={r._id}
                                    key={i}
                                    deleteReply={deleteReply}
                                    createdAt={r.createdAt}
                                />
                            ))}
                        </Fragment>
                    )
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
                            {interactionLang[userLang].deleteMsg}
                        </div>

                    </ModalMini>
                </div>
            </div>
        </div>
    </>
}

export default LessonMessage;