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
    createdAt: string;
}

interface Props {
    message: messageInterface;
    deleteMessage: (messageId: string) => void;
    courseAuthorId: string;
}

const LessonMessage: React.FC<Props> = ({ message, deleteMessage, courseAuthorId }) => {
    const sessionUserId = useSelector((state: stateInterface ) => state.sessionReducer.sessionUser._id);
    const [messageOptions, setMessageOptions] = useState(false);
    const [showTextfield, setShowTextfield] = useState(false);

    const DateFormat = (str: string) => {
        const monthNr = str.substring(5, 7);
        const year = str.substring(0, 4);
        const dateNr = str.substring(8, 10);
        const monthsArr = ['nil', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthsArr[monthNr]} ${dateNr}, ${year}`
    }
    
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
                        Antworten
                    </button>
                    <button>
                        Mir gefällt's
                    </button>
                </div>

                {showTextfield ? (
                    <textarea
                        cols={33}
                        rows={3}
                        onBlur={() => setShowTextfield(false)}
                        // value={message}
                        // onChange={(event) => setMessage(event.target.value)}
                    />
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