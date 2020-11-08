import React, { useState, Fragment } from 'react'
import Router from 'next/router'
import styles from './Accordion.module.css'
import { ExpandMore, ExpandLess, Edit } from '@material-ui/icons'
import { Draggable, resetServerContext } from 'react-beautiful-dnd'
import TextfieldMini from '../Forms/Textfield/TextfieldMini';
import MiniButton from '../SeedsButton/MiniButton';
import axios from 'axios'

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
                                    <div onClick={() => setToggleTitleInput(true)} className={styles.EditIcon}>
                                        <Edit style={{ margin: '0 0 0 8px' }} fontSize="small" />
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <TextfieldMini
                                    inputType="text"
                                    placeholder="Type new section title"
                                    inputValue={newTitle}
                                    updateState={(event) => setNewTitle(event.target.value)}
                                    />
                                    <div onClick={changeSectionTitle} className={styles.EditTitleButton}>
                                        <MiniButton text="save title" />
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