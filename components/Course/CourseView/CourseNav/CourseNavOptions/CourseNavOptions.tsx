import { Chat } from '@material-ui/icons'
import React from 'react'
import styles from './CourseNavOptions.module.css'

interface Props {
    pickNavOption: (navOption: string) => void;
    activeOption: string;
}

const CourseNavOptions: React.FC<Props> = ({ pickNavOption, activeOption }) => {
    return<>
        <div className={styles.CourseNavOptions}>
            <div
                className={activeOption === 'lessons' ? styles.Active : styles.HoverBox}
                onClick={() => pickNavOption('lessons')}
                style={{margin: '0 16px 0 -8px'}}
            >
                <p>
                    Lessons
                </p>
            </div>
            <div
                className={activeOption === 'chat' ? styles.Active : styles.HoverBox}
                onClick={() => pickNavOption('chat')}
                style={{margin: '0 0 0 16px'}}
            >
                <p style={{ width: '50px', justifyContent: 'center' }}>
                    <Chat style={{ margin: '2px 0 0 0' }} fontSize="small" />
                </p>
            </div>
        </div>
    </>
}

export default CourseNavOptions;