import React, { useState, Fragment } from 'react'
import Router from 'next/router'
import styles from './Accordion.module.css'
import moreStyles from './../../Course/Editor/LessonItem/LessonOptions/LessonOptions.module.css'
import { ExpandMore, ExpandLess, Edit, Settings, Title, Delete } from '@material-ui/icons'
import { Draggable, resetServerContext } from 'react-beautiful-dnd'
import TextfieldMini from '../Forms/Textfield/TextfieldMini';
import MiniButton from '../SeedsButton/MiniButton';
import ModalMini from './../Modals/ModalMini/ModalMini'
import axios from 'axios'
import { useSelector } from 'react-redux'
import stateInterface from '../../../interfaces/stateInterface'
import courseEditorLang from '../../../util/language/pages/course-editor'

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: '0',
    margin: '0',

    // change background colour if dragging
    background: isDragging ? "lightgray" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

resetServerContext()

interface Props {
    sectionTitle: string;
    sectionId: string;
    sectionIndex: number;
    courseId: string;
}

const Accordion: React.FC<Props> = ({ sectionTitle, children, sectionId, sectionIndex, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [toggleTitleInput, setToggleTitleInput] = useState(false);
    const [showSectionOptions, toggleSectionOptions] = useState(false);
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    const changeSectionTitle = async () => {
        try {
            const editTitle = await axios.patch(`/c-api/edit-section-title/${sectionId}`, { newTitle: newTitle });
            setNewTitle('');
            setToggleTitleInput(false);
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteSection = async () => {
        try {
            const deletedSection = await axios.delete(`/c-api/section/${sectionId}`);
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Draggable draggableId={sectionId} index={sectionIndex}>
            {(provided, snapshot) => (
                <div
                    className={styles.Accordion}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    <div className={styles.Button}>
                        <div className={styles.AccordionSummaryDiv}>
                            {!toggleTitleInput ? (
                                <Fragment>
                                    {sectionTitle}
                                    <div
                                    onMouseEnter={() => toggleSectionOptions(true)}
                                    onMouseLeave={() => toggleSectionOptions(false)}
                                    className={styles.SettingsDiv}
                                    >
                                        <Settings style={{ margin: '0 0 0 8px' }} fontSize="small" />
                                        <ModalMini position="left" show={showSectionOptions}>
                                            <div onClick={() => setToggleTitleInput(true)} className={moreStyles.ModalListItem}>
                                                <Title />
                                                {courseEditorLang[userLang].editSection}
                                            </div>
                                            <div onClick={deleteSection} className={moreStyles.ModalListItem}>
                                                <Delete />
                                                {courseEditorLang[userLang].deleteSection}
                                            </div>
                                        </ModalMini>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <TextfieldMini
                                    inputType="text"
                                    placeholder={courseEditorLang[userLang].editSectionPh}
                                    inputValue={newTitle}
                                    updateState={(event) => setNewTitle(event.target.value)}
                                    />
                                    <div onClick={changeSectionTitle} className={styles.EditTitleButton}>
                                        <MiniButton text={courseEditorLang[userLang].editSectionBtn} />
                                    </div>
                                </Fragment>
                            )}
                        </div>
                        <div className={styles.AccordionSummaryDiv}>
                            {
                                expanded ? (
                                    <ExpandLess onClick={toggleExpanded} style={{ color: '#808080', cursor: 'pointer' }} />
                                ) : <ExpandMore onClick={toggleExpanded} style={{ color: '#808080', cursor: 'pointer' }} />
                            }
                        </div>
                    </div>
                    <div className={!expanded ? [styles.AccordionContent, styles.Closed].join(' ') : [styles.AccordionContent, styles.Open].join(' ')}>
                        {children}
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default Accordion;