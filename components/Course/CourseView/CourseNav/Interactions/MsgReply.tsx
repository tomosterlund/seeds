import { Delete, MoreHoriz } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../../interfaces/stateInterface'
import ModalMini from '../../../../UI/Modals/ModalMini/ModalMini'
import styles from './MsgReply.module.css'
import moreStyles from './../../../Editor/LessonItem/LessonOptions/LessonOptions.module.css'
import muchStyles from './LessonMessage.module.css'
import DateFormat from '../../../../../util/dates/date-tag'
import interactionLang from '../../../../../util/language/pages/lesson-interaction'

interface Props {
    content: string;
    authorName: string;
    authorImageUrl: string;
    authorId: string;
    createdAt: string;
    deleteReply: (replyId: string) => void;
    _id: string;
}

const MsgReply: React.FC<Props> = ({ content, authorId, authorImageUrl, authorName, deleteReply, _id, createdAt }) => {

    const sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);
    const [canDelete, setCanDelete] = useState(false);
    const [showOpts, setShowOpts] = useState(false);
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    useEffect(() => {
        if (sessionUser._id === authorId) {
            setCanDelete(true);
        }
    }, [])

    return<>
        <div className={styles.MsgReply}>
            <div style={{backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${authorImageUrl}')`}} className={styles.AuthorImage} />
            <div className={styles.ReplyBody}>
                <h3>
                    {authorName}
                    <p style={{ margin: '0 0 0 8px' }} className={muchStyles.TimeStamp}>
                        {DateFormat(createdAt)}
                    </p>
                    {canDelete ? (
                        <div onClick={() => setShowOpts(true)} className={styles.MoreIcon}>
                            <MoreHoriz fontSize="small" />
                        </div>
                    ) : null}
                </h3>
                <p>
                    {content}
                </p>
                <ModalMini position="right" show={showOpts}>
                    <div
                        onClick={() => deleteReply(_id)}
                        className={moreStyles.ModalListItem}
                        onMouseLeave={() => setShowOpts(false)}
                    >
                        <Delete />
                        {interactionLang[userLang].deleteReply}
                    </div>
                </ModalMini>
            </div>
        </div>
    </>
}

export default MsgReply;