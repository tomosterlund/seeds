import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import styles from './AddVideo.module.css'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import { Error, Movie, Publish } from '@material-ui/icons'
import { CircularProgress } from '@material-ui/core'
import Textfield from './../../../UI/Forms/Textfield/Textfield'
import ImageUploadButton from './../../../UI/Forms/ImageUploadButton/ImageUploadButton'
import AppButton from './../../../UI/SeedsButton/SeedButton'
import axios from 'axios'
import { checkFileFormat } from './../../../../util/form-validation/file-format'
import SeedButton from './../../../UI/SeedsButton/SeedButton'
import stateInterface from '../../../../interfaces/stateInterface'
import { connect } from 'react-redux'
import courseEditorLang from '../../../../util/language/pages/course-editor'

interface Props {
    show: boolean;
    sectionId: string;
    courseId: string;
    close: () => void;
    userLang: string;
}

interface State {
    title: string;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
    correctMimetype: boolean;
}

class AddVideo extends Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        title: '',
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
        loading: false,
        correctMimetype: true
    }

    inputChangeHandler = (event) => {
        const newTitle = event.target.value;
        this.setState({ title: newTitle });
    }

    openFilePicker = () => {
        this.fileInput.current.click();
    }

    getPhoto = e => {
        if (!e.target.files[0]) {return}
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        console.log(file);

        reader.onloadend = () => {
          this.setState({
            selectedFile: file,
            file: file.name,
            imagePreviewUrl: reader.result
          });
        }

        reader.readAsDataURL(file);

        const mimetypeCheck = checkFileFormat(file.name, ['mp4', 'mov', 'wmv']);
        if (!mimetypeCheck) {
            this.setState({ correctMimetype: false });
        } else if (mimetypeCheck) {
            this.setState({ correctMimetype: true });
        }
    }

    dumpChosenFile = () => {
        this.setState({
            selectedFile: null,
            file: '',
            imagePreviewUrl: '',
            correctMimetype: true
        });
    }

    postVideoHandler = async () => {
        this.setState({ loading: true });
        try {
            let fd = new FormData();
            fd.append('title', JSON.stringify({
                title: this.state.title,
                courseId: this.props.courseId,
                sectionId: this.props.sectionId
            }));
            fd.append('video', this.state.selectedFile);
            const postedVideo = await axios.post(`/c-api/course/${this.props.courseId}/add-video`, fd);
            const newState = this.state;
            newState.loading = false;
            newState.title = '';
            newState.selectedFile = null;
            newState.file = '';
            this.setState({ ...newState });
            Router.push(`/course/editor/${this.props.courseId}`, undefined, { shallow: false });
            this.props.close();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return<>
            <ModalLarge show={this.props.show}>
                {this.state.correctMimetype ? (
                    <Fragment>
                        <div className={styles.AddVideoHeader}>
                            <h2>{courseEditorLang[this.props.userLang].addVideoHeader}</h2>
                            <Movie />
                        </div>
                        <span style={{ margin: '8px 0 0 0' }}>
                            <Textfield
                            inputValue={this.state.title}
                            placeholder={courseEditorLang[this.props.userLang].videoTitlePh}
                            label={courseEditorLang[this.props.userLang].videoTitleLabel}
                            inputType="text"
                            fieldName="title"
                            changeHandler={this.inputChangeHandler}
                            />
                        </span>
                        <ImageUploadButton camera={false} chosenImage={this.state.file} openFileHandler={this.openFilePicker} text={courseEditorLang[this.props.userLang].videoUpload}>
                            <Publish />
                        </ImageUploadButton>
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {
                            !this.state.loading ? (
                                <AppButton click={this.postVideoHandler} text={courseEditorLang[this.props.userLang].doneButton} image={false} />
                            ) : (
                                <Fragment>
                                    <CircularProgress style={{ margin: '16px' }} />
                                    <div className={styles.UploadPercentage}>{courseEditorLang[this.props.userLang].progress}</div>
                                </Fragment>
                            )
                        }
                    </Fragment>
                ) : (
                    <Fragment>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Error style={{ margin: '0 6px 0 0' }} />
                            <h2 style={{ fontSize: '16px' }}>{courseEditorLang[this.props.userLang].errorHeader}</h2>
                        </div>
                        <p>{courseEditorLang[this.props.userLang].errorText}:</p>
                        <ul className={styles.FormatList}>
                            <li>.mp4</li>
                            <li>.mov</li>
                            <li>.wmv</li>
                        </ul>
                        <SeedButton
                            text={courseEditorLang[this.props.userLang].gotitButton}
                            image={false}
                            click={this.dumpChosenFile}
                        />
                    </Fragment>
                )}
            </ModalLarge>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language
})

export default connect(mapStateToProps)(AddVideo);