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

class CreateCourse extends Component {
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
            <Layout title="Create new course | Seeds">
                <div className={styles.CreateCoursePage}>
                    <SeedsHeader text="Create new course" />
                    <form className={styles.Form} onSubmit={this.createCourseHandler}>
                        <TextField
                        inputValue={this.state.course.title.value}
                        placeholder="Enter the title of the course here"
                        label="Course title"
                        fieldName="title"
                        inputType="text"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Select
                        inputValue={this.state.course.category.value}
                        label="Category"
                        changeHandler={this.inputChangeHandler}
                        fieldName="category"
                        />
                        <ImageUploadButton camera={true} text="Course image" chosenImage={this.state.file} openFileHandler={this.openFilePicker} />
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {
                            !this.state.loading ? (
                                <AppButton text="Create course" image={false} />
                            ) : <CircularProgress style={{ margin: '16px 0 0 0' }} />
                        }
                        
                    </form>
                </div>
            </Layout>
        </>
    }
}

export default CreateCourse;