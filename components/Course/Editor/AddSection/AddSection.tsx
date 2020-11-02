import React, { useState } from 'react'
import styles from './AddSection.module.css'
import Modal from './../../../UI/Modals/ModalNormal/ModalNormal'
import SeedsHeader from './../../../Presentational/SeedsHeader/SeedsHeader'
import Textfield from './../../../UI/Forms/Textfield/TextfieldMini'
import AppButton from './../../../UI/SeedsButton/SeedButton'
import { PlusCircle } from 'react-bootstrap-icons'
import axios from 'axios'
import Router from 'next/router'

interface Props {
    show: boolean;
    courseId: string;
    close: () => void;
}

const AddSection: React.FC<Props> = ({ show, courseId, close }) => {
    const [sectionTitle, setSectionTitle] = useState('');

    const updateSectionTitle = (event) => {
        setSectionTitle(event.target.value);
    }

    const createSectionHandler = async () => {
        console.log('Created section');
        try {
            const createdSection = await axios.post(`/c-api/course/${courseId}/add-section`, {sectionTitle});
            console.log(createdSection);
            close();
            setSectionTitle('');
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return<>
        <Modal show={show}>
            <SeedsHeader text="Create a section" />
            <div style={{ margin: '16px 0 0 0', width: '100%' }}>
                <Textfield
                inputValue={sectionTitle}
                placeholder="Choose a title for the section"
                inputType="text"
                updateState={updateSectionTitle}
                />
            </div>
            <AppButton click={createSectionHandler} text="Add section" image={false}>
                <PlusCircle />
            </AppButton>
        </Modal>
    </>
}

export default AddSection;