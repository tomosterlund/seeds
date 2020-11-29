import React, { Component, Fragment } from "react";
import SeedsHeader from "../../../Presentational/SeedsHeader/SeedsHeader";
import ImageUploadButton from "../../../UI/Forms/ImageUploadButton/ImageUploadButton";
import Textfield from "../../../UI/Forms/Textfield/Textfield";
import ModalLarge from "../../../UI/Modals/LargeModal/LargeModal";
import SeedButton from "../../../UI/SeedsButton/SeedButton";
import axios from 'axios'
import Router from "next/router";
import { CircularProgress } from "@material-ui/core";
import stateInterface from "../../../../interfaces/stateInterface";
import { connect } from "react-redux";
import courseEditorLang from "../../../../util/language/pages/course-editor";
import styles from './CourseSettings.module.css'
import { WarningRounded } from "@material-ui/icons";
import { checkFileFormat } from "../../../../util/form-validation/file-format";

interface Props {
    show: boolean;
    courseId: string;
    title: string;
    close: () => void;
    userLang: string;
    sessionUserId: string;
}

interface State {
    courseTitle: string;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
    showDeleteWarning: boolean;
    fileError: boolean;
}

class CourseSettings extends Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        courseTitle: this.props.title,
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
        loading: false,
        showDeleteWarning: false,
        fileError: false
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

        const fileOK = checkFileFormat(file.name, ['png', 'jpg', 'gif']);
        if (!fileOK) {
            return this.setState({ fileError: true });
        }

        reader.onloadend = () => {
          this.setState({
            selectedFile: file,
            file: file.name,
            imagePreviewUrl: reader.result
          });
        }

        reader.readAsDataURL(file);
    }

    textInputHandler = (event: any, fieldName: string) => {
        const targetValue = event.target.value;
        const newState = this.state;
        newState[fieldName] = targetValue;
        this.setState({ ...newState });
    }

    deleteCourse = async () => {
        this.setState({ loading: true });
        try {
            const deletedCourse = await axios.delete(`/c-api/course/${this.props.courseId}`);
            console.log(deletedCourse);
            this.setState({ loading: false });
            Router.push(`/my-courses/${this.props.sessionUserId}`);
        } catch (error) {
            console.log(error);
        }
    }

    saveChanges = async () => {
        this.setState({ loading: true });
        try {
            let fd = new FormData();
            fd.append('title', JSON.stringify({title: this.state.courseTitle}));
            fd.append('image', this.state.selectedFile);
            const savedChanges = await axios.patch(`/c-api/edit-course/${this.props.courseId}`, fd);
            console.log(savedChanges);
            Router.push(`/course/editor/${this.props.courseId}`);
            this.setState({ loading: false });
            this.props.close();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return<>
            <ModalLarge show={this.props.show}>

                {!this.state.fileError ? (
                    <Fragment>

                        <SeedsHeader text={courseEditorLang[this.props.userLang].editCourseHdr} />
                        <Textfield
                            label={courseEditorLang[this.props.userLang].editCourseTitle}
                            placeholder={courseEditorLang[this.props.userLang].editCourseTitlePh}
                            inputValue={this.state.courseTitle}
                            inputType="text"
                            changeHandler={this.textInputHandler}
                            fieldName="courseTitle"
                        />
                        <ImageUploadButton
                            openFileHandler={this.openFilePicker}
                            text={courseEditorLang[this.props.userLang].changeImage}
                            camera={true}
                            chosenImage={this.state.file}
                        />
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {!this.state.loading ? (
                            <div className={styles.ButtonContainer}>
                                <SeedButton
                                    click={this.saveChanges}
                                    text={courseEditorLang[this.props.userLang].saveCourseEdits}
                                    image={false}
                                />
        
                                {!this.state.showDeleteWarning ? (
                                    <SeedButton
                                        click={() => this.setState({ showDeleteWarning: true })}
                                        text={courseEditorLang[this.props.userLang].deleteCourse}
                                        image={false}
                                        backgroundColor="red"
                                    />
                                ) : null}
                            </div>
                        ) : (
                            <CircularProgress style={{ margin: '8px 0 0 0' }} />
                        )}
        
                        {this.state.showDeleteWarning ? (
                            <Fragment>
                                <div className={styles.WarningHdrContainer}>
                                    <WarningRounded fontSize="small" />
                                    <h3>
                                        {courseEditorLang[this.props.userLang].deleteWarningHdr}
                                    </h3>
                                </div>
        
                                <p>
                                    {courseEditorLang[this.props.userLang].deleteWarningTxt}
                                </p>
        
                                <SeedButton
                                    text={courseEditorLang[this.props.userLang].cancelCourseDeletion}
                                    image={false}
                                    click={() => this.setState({ showDeleteWarning: false })}
                                />
        
                                <SeedButton
                                    text={courseEditorLang[this.props.userLang].deleteWarningBtn}
                                    image={false}
                                    backgroundColor="red"
                                    click={this.deleteCourse}
                                />
                            </Fragment>
                        ) : null}

                    </Fragment>
                ) : (
                    <Fragment>
                        <div className={styles.WarningHdrContainer}>
                            <WarningRounded fontSize="small" />
                            <h3>
                                {courseEditorLang[this.props.userLang].errorHeader}
                            </h3>
                        </div>

                        <p>
                            {courseEditorLang[this.props.userLang].errorText}:
                        </p>

                        <ul>
                            <li>.png</li>
                            <li>.jpg</li>
                            <li>.gif</li>
                        </ul>

                        <SeedButton
                            text={courseEditorLang[this.props.userLang].gotitButton}
                            image={false}
                            click={() => this.setState({ fileError: false })}
                        />
                    </Fragment>
                )}
            </ModalLarge>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language,
    sessionUserId: state.sessionReducer.sessionUser._id
})

export default connect(mapStateToProps)(CourseSettings);