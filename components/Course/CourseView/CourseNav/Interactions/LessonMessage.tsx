import React from 'react'
import styles from './LessonMessage.module.css'

interface messageInterface {
    content: string;
    lessonId: string;
    authorName: string;
    authorId: string;
    authorImageUrl: string;
    popularity: string;
    voters: string[];
}

interface Props {
    message: messageInterface;
}

const LessonMessage: React.FC<Props> = ({ message }) => {
    return<>
        <div className={styles.LessonMessage}>
            <div
                className={styles.AuthorImage}
                style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${message.authorImageUrl}')` }}
            />
            <div className={styles.MessageBody}>
                {message.content}
            </div>
        </div>
    </>
}

export default LessonMessage;