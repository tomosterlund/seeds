import React, { useState, useRef, useEffect } from 'react'
import Router from 'next/router'
import styles from './Sections.module.css'
import Accordion from './../../../UI/Accordion/Accordion'
import LessonItem from './../LessonItem/LessonItem'
import AddLessonOptions from './../AddLessonOptions/AddLessonOptions'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { resetServerContext } from "react-beautiful-dnd"
import axios from 'axios'

interface Props {
    sections: [];
    openAddLesson: (lessonType: string, sectionId: string) => void;
    courseId: string;
    sectionIds: [];
}

interface Section {
    title: string;
    _id: string;
    lessons: [];
}

interface Lesson {
    title: string;
    lessonId: string;
    lessonType: 'video' | 'text' | 'quiz';
}

const reorder = (list, startIndex, endIndex): Section[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};


const Sections: React.FC<Props> = ({ sections, openAddLesson, courseId, sectionIds }) => {
    const [courseSections, setCourseSections] = useState(sections);

    const prevSections = usePrevious(sections);

    useEffect(() => {
        if (prevSections !== sections) {
            setCourseSections(sections);
        }
    })

    const onDragEnd = async (result: any) => {
        // Setting the new state within the app
        if (!result.destination) { return; }
        const newList = reorder(
            courseSections,
            result.source.index,
            result.destination.index
        );
        setCourseSections(newList);

        // Posting the new order
        let newOrder = [];
        for (let s of newList) {
            newOrder.push(s._id);
        }
        console.log(newOrder);
        const newOrderPosted = await axios.post(`/c-api/course/${courseId}/reorder-sections`, newOrder);
        Router.push(`/course/editor/${courseId}`);
    }

    resetServerContext()

    return <>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.SectionsDiv}
                    >
                        {
                            courseSections.map((s: Section, index) => (
                                <Accordion key={s._id} sectionTitle={s.title} sectionIndex={index} sectionId={s._id}>
                                    {
                                        s.lessons.map((l: Lesson, i) => (
                                            <div key={i}>
                                                <LessonItem
                                                    title={l.title}
                                                    lessonType={l.lessonType}
                                                    lessonId={l.lessonId}
                                                    courseId={courseId}
                                                    sectionId={s._id}
                                                />
                                            </div>
                                        ))
                                    }
                                    <hr></hr>
                                    <AddLessonOptions addLesson={openAddLesson} sectionId={s._id} />
                                </Accordion>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </>
}

function usePrevious(sections: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = sections;
    });
    return ref.current;
}

export default Sections;