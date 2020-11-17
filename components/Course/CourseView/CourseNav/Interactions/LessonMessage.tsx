import { Delete, MoreHoriz } from '@material-ui/icons'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../../interfaces/stateInterface'
import ModalMini from '../../../../UI/Modals/ModalMini/ModalMini'
import styles from './LessonMessage.module.css'
import moreStyles from './../../../Editor/LessonItem/LessonOptions/LessonOptions.module.css'

interface messageInterface {
    content: string;
    lessonId: string;
    authorName: string;
    authorId: string;
    authorImageUrl: string;
    popularity: string;
    voters: string[];
    _id: string;
}

interface Props {
    message: messageInterface;
    deleteMessage: (messageId: string) => void;
    courseAuthorId: string;
}

const LessonMessage: React.FC<Props> = ({ message, deleteMessage, courseAuthorId }) => {
    const sessionUserId = useSelector((state: stateInterface ) => state.sessionReducer.sessionUser._id);
    const [messageOptions, setMessageOptions] = useState(false);
    
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
                            <div onMouseOver={() => setMessageOptions(true)} className={styles.MoreIcon}>
                                <MoreHoriz fontSize="small" />
                            </div>
                        ) : null
                    }
                </div>
                {message.content}

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