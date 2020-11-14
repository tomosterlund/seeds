import React, { Fragment } from 'react'
import TextLesson from '../../../../../interfaces/LessonInterfaces/LessonInterface';
import styles from './TextSpace.module.css'

interface Props {
    textData: TextLesson;
}

const TextSpace: React.FC<Props> = ({ textData }) => {
    return <>
        <Fragment>
            <div dangerouslySetInnerHTML={{ __html: textData.content }} className={styles.TextSpace}>
                {/* <h2>{textData.content}</h2> */}
            </div>
        </Fragment>
    </>
}

export default TextSpace;