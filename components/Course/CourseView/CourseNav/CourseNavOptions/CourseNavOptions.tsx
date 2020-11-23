import { Chat } from '@material-ui/icons'
import React from 'react'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../../interfaces/stateInterface'
import courseViewLang from '../../../../../util/language/pages/course-view'
import styles from './CourseNavOptions.module.css'

interface Props {
    pickNavOption: (navOption: string) => void;
    activeOption: string;
}

const CourseNavOptions: React.FC<Props> = ({ pickNavOption, activeOption }) => {

    const userlang = useSelector((state: stateInterface) => state.languageReducer.language);

    return<>
        <div className={styles.CourseNavOptions}>
            <div
                className={activeOption === 'lessons' ? styles.Active : styles.HoverBox}
                onClick={() => pickNavOption('lessons')}
                style={{margin: '0 16px 0 -8px'}}
            >
                <p>
                    {courseViewLang[userlang].lessonsOpt}
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