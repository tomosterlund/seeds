import React, { Component } from 'react'
import Router from 'next/router'
import styles from './AddText.module.css'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import Textfield from './../../../UI/Forms/Textfield/Textfield'
import { Editor } from '@tinymce/tinymce-react'
import SeedsButton from './../../../UI/SeedsButton/SeedButton'
import { Subject } from '@material-ui/icons'
import axios from 'axios'
import stateInterface from '../../../../interfaces/stateInterface'
import courseEditorLang from '../../../../util/language/pages/course-editor'
import { connect } from 'react-redux'

interface Props {
    show: boolean;
    courseId: string;
    sectionId: string;
    close: () => void;
    userLang: string;
}

interface State {
    TinyMCEContent: string;
    title: string;
}

class AddText extends Component<Props, State> {
    state = {
        TinyMCEContent: '',
        title: ''
    }

    handleEditorChange = (content: any, editor: any) => {
        this.setState({ TinyMCEContent: content });
    }

    titleChangeHandler = (event: any, fieldName: string) => {
        const newState = this.state;
        newState[fieldName] = event.target.value;
        this.setState({ ...newState });
        console.log(this.state.title);
    }

    postText = async () => {
        try {
            const reqBody = {
                sectionId: this.props.sectionId,
                title: this.state.title,
                content: this.state.TinyMCEContent,
            }
            const postedText = await axios.post(`/c-api/course/${this.props.courseId}/add-text`, reqBody);
            console.log(postedText);
            const resetState = this.state;
            resetState.TinyMCEContent = '';
            resetState.title = '';
            this.setState({ ...resetState });
            Router.push(`/course/editor/${this.props.courseId}`, undefined, { shallow: false });
            this.props.close();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return <>
            <ModalLarge show={this.props.show}>
                <div className={styles.AddTextHeader}>
                    <h2>{courseEditorLang[this.props.userLang].textHeader}</h2>
                    <Subject />
                </div>
                <div style={{ margin: '0 0 16px 0' }}>
                    <Textfield
                    label={courseEditorLang[this.props.userLang].titleInputLabel}
                    placeholder={courseEditorLang[this.props.userLang].titleInputPh}
                    inputType="text"
                    inputValue={this.state.title}
                    fieldName="title"
                    changeHandler={this.titleChangeHandler}
                    />

                </div>
                <Editor
                    apiKey='xz2pzqz9zwzcekk7psj8ho9kc6huj4rcqw2qflv5a03v1diu'
                    initialValue={courseEditorLang[this.props.userLang].editorInitialValue}
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
                    onEditorChange={this.handleEditorChange}
                />
                <SeedsButton click={this.postText} text={courseEditorLang[this.props.userLang].textDoneButton} image={false} />
            </ModalLarge>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language
})

export default connect(mapStateToProps)(AddText);