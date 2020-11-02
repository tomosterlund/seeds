import React, { useState } from 'react'
import styles from './Accordion.module.css'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import { Draggable } from 'react-beautiful-dnd'
import { resetServerContext } from "react-beautiful-dnd"

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
}

const Accordion: React.FC<Props> = ({ sectionTitle, children, sectionId, sectionIndex }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
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
                    <div className={styles.Button} onClick={toggleExpanded}>
                        <div className={styles.AccordionSummaryDiv}>
                            {sectionTitle}
                        </div>
                        <div className={styles.AccordionSummaryDiv}>
                            {
                                expanded ? (
                                    <ExpandLess onClick={toggleExpanded} style={{ color: '#808080' }} />
                                ) : <ExpandMore onClick={toggleExpanded} style={{ color: '#808080' }} />
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