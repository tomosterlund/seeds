import React, { useState } from 'react'
import Modal from './../../../UI/Modals/ModalNormal/ModalNormal'
import SeedsHeader from './../../../Presentational/SeedsHeader/SeedsHeader'
import Textfield from './../../../UI/Forms/Textfield/TextfieldMini'
import AppButton from './../../../UI/SeedsButton/SeedButton'
import { PlusCircle } from 'react-bootstrap-icons'
import axios from 'axios'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import stateInterface from '../../../../interfaces/stateInterface'
import courseEditorLang from '../../../../util/language/pages/course-editor'

interface Props {
    show: boolean;
    courseId: string;
    close: () => void;
}

const AddSection: React.FC<Props> = ({ show, courseId, close }) => {
    const [sectionTitle, setSectionTitle] = useState('');
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language)

    const updateSectionTitle = (event) => {
        setSectionTitle(event.target.value);
    }

    const createSectionHandler = async () => {
        try {
            const createdSection = await axios.post(`/c-api/course/${courseId}/add-section`, {sectionTitle});
            close();
            setSectionTitle('');
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return<>
        <Modal show={show}>
            <SeedsHeader text={courseEditorLang[userLang].addSectionHeader} />
            <div style={{ margin: '16px 0 0 0', width: '100%' }}>
                <Textfield
                inputValue={sectionTitle}
                placeholder={courseEditorLang[userLang].addSectionPh}
                inputType="text"
                updateState={updateSectionTitle}
                />
            </div>
            <AppButton click={createSectionHandler} text={courseEditorLang[userLang].sectionDoneBtn} image={false}>
                <PlusCircle style={{ margin: '0 6px 0 0' }} />
            </AppButton>
        </Modal>
    </>
}

export default AddSection;