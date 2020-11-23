import React, { Component, createRef } from 'react'
import Router from 'next/router'
import Layout from './../../../components/Layout/Layout'
import styles from './CreateCourse.module.css'
import SeedsHeader from './../../../components/Presentational/SeedsHeader/SeedsHeader'
import TextField from './../../../components/UI/Forms/Textfield/Textfield'
import AppButton from './../../../components/UI/SeedsButton/SeedButton'
import ImageUploadButton from './../../../components/UI/Forms/ImageUploadButton/ImageUploadButton'
import Select from './../../../components/UI/Forms/Select/Select'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { connect } from 'react-redux'
import stateInterface from '../../../interfaces/stateInterface'
import createCourseLang from '../../../util/language/course-editor/create-course'

interface Props {
    userLang: string;
}

interface State {
    course: any;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
}

class CreateCourse extends Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        course: {
            title: {
                value: '',
                valid: false
            },
            category: {
                value: 'languages',
                valid: false
            }
        },
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
        loading: false
    }

    inputChangeHandler = (event, fieldName) => {
        const newState = this.state;
        newState.course[fieldName].value = event.target.value;
        this.setState({ ...newState });
    }

    createCourseHandler = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        console.log('Created course');
        try {
            let fd = new FormData();
            fd.append('courseData', JSON.stringify({
                title: this.state.course.title.value,
                category: this.state.course.category.value
            }));
            fd.append('image', this.state.selectedFile);
            const postAttempt = await axios.post('/c-api/course/create-new', fd);
            const courseId = postAttempt.data.courseId;
            this.setState({ loading: false });
            Router.push(`/course/editor/${courseId}`);
        } catch (error) {
            console.log(error);
        }
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
    }

    render() {
        return<>
            <Layout title={createCourseLang[this.props.userLang].pageTitle}>
                <div className={styles.CreateCoursePage}>
                    <SeedsHeader text={createCourseLang[this.props.userLang].header} />
                    <form className={styles.Form} onSubmit={this.createCourseHandler}>
                        <TextField
                        inputValue={this.state.course.title.value}
                        placeholder={createCourseLang[this.props.userLang].titlePh}
                        label={createCourseLang[this.props.userLang].titleField}
                        fieldName="title"
                        inputType="text"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Select
                        inputValue={this.state.course.category.value}
                        label={createCourseLang[this.props.userLang].categoryField}
                        changeHandler={this.inputChangeHandler}
                        fieldName="category"
                        />
                        <ImageUploadButton camera={true} text={createCourseLang[this.props.userLang].uploadText} chosenImage={this.state.file} openFileHandler={this.openFilePicker} />
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {
                            !this.state.loading ? (
                                <AppButton text={createCourseLang[this.props.userLang].button} image={false} />
                            ) : <CircularProgress style={{ margin: '16px 0 0 0' }} />
                        }
                        
                    </form>
                </div>
            </Layout>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language
  });

export default connect(mapStateToProps)(CreateCourse);