import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import styles from './EditText.module.css'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import { Editor } from '@tinymce/tinymce-react'
import SeedsButton from './../../../UI/SeedsButton/SeedButton'
import SeedsHeader from './../../../Presentational/SeedsHeader/SeedsHeader'
import axios from 'axios'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../interfaces/stateInterface'
import courseEditorLang from '../../../../util/language/pages/course-editor'

interface Props {
    show: boolean;
    lessonId: string;
    textContent: string;
    close: () => void;
}

const EditText: React.FC<Props> = ({ show, lessonId, textContent, close }) => {
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [TinyMCEContent, setTinyMCEContent] = useState('');
    const handleEditorChange = (content: any, editor: any) => {
        setTinyMCEContent(content);
    }

    useEffect(() => {
        if (!TinyMCEContent) {
            setTinyMCEContent(textContent);
        }
    })

    const saveChangesHandler = async () => {
        try {
            const editedTextDoc = await axios.post(`/c-api/edit-text/${lessonId}`, { editedText: TinyMCEContent });
            close();
            Router.push(`/course/editor/${editedTextDoc.data.courseId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <ModalLarge show={show}>
            <div style={{ margin: '0 0 16px 0' }}>
                <SeedsHeader text={courseEditorLang[userLang].editTextHdr} />
            </div>
            <Editor
                apiKey='xz2pzqz9zwzcekk7psj8ho9kc6huj4rcqw2qflv5a03v1diu'
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                }}
                value={TinyMCEContent}
                onEditorChange={handleEditorChange}
            />
            <SeedsButton click={saveChangesHandler} text={courseEditorLang[userLang].saveTextChanges} image={false} />
        </ModalLarge>
    </>
}

export default EditText;