import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './NavLessons.module.css'
import sectionInterface from './../../../../../interfaces/sectionInterface'
import lessonInterface from '../../../../../interfaces/lessonInterface'
import { Movie, Subject, HelpOutline } from '@material-ui/icons'
import Axios from 'axios'

interface Props {
    sections: [];
    goToLesson: (lessonId: string, lessonType: string) => void;
}

const NavLessons: React.FC<Props> = ({ sections, goToLesson }) => {
    const router = useRouter();
    const { lessonid } = router.query;

    const [activeLesson, setActiveLesson] = useState('');

    
    useEffect(() => {
        if (activeLesson === '') {
            setActiveLesson(String(lessonid));
        }
    }, [])

    const lessonIcon = (lessonType: string) => {
        if (lessonType === 'video') {return <Movie fontSize="small" />}
        if (lessonType === 'text') {return <Subject fontSize="small" />}
        if (lessonType === 'quiz') {return <HelpOutline fontSize="small" />}
    }

    const executeGoToLesson = (lessonId: string, lessonType: string) => {
        setActiveLesson(lessonId);
        goToLesson(lessonId, lessonType)
    }

    return<>
        <div className={styles.NavLessons}>
            {
                sections.map((s: sectionInterface) => (
                    <div key={s._id}>
                        <h3>{s.title}</h3>
                        {
                            s.lessons.map((l: lessonInterface) => (
                                <div
                                    className={activeLesson === l.lessonId ? [styles.LessonItem, styles.Active].join(' ') : styles.LessonItem}
                                    key={l.lessonId}
                                    onClick={() => executeGoToLesson(l.lessonId, l.lessonType)}
                                >
                                    {lessonIcon(l.lessonType)}
                                    <p>
                                        {l.title}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    </>
}

export default NavLessons;