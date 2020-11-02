import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import styles from './AddVideo.module.css'
import ModalLarge from './../../../UI/Modals/LargeModal/LargeModal'
import { Movie, Publish } from '@material-ui/icons'
import { CircularProgress } from '@material-ui/core'
import Textfield from './../../../UI/Forms/Textfield/Textfield'
import ImageUploadButton from './../../../UI/Forms/ImageUploadButton/ImageUploadButton'
import AppButton from './../../../UI/SeedsButton/SeedButton'
import axios from 'axios'

interface Props {
    show: boolean;
    sectionId: string;
    courseId: string;
    close: () => void;
}

interface State {
    title: string;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
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
                <div className={styles.AddVideoHeader}>
                    <h2>Add video lesson</h2>
                    <Movie />
                </div>
                <span style={{ margin: '8px 0 0 0' }}>
                    <Textfield
                    inputValue={this.state.title}
                    placeholder="Pick a title for the video"
                    label="Video title"
                    inputType="text"
                    fieldName="title"
                    changeHandler={this.inputChangeHandler}
                    />
                </span>
                <ImageUploadButton camera={false} chosenImage={this.state.file} openFileHandler={this.openFilePicker} text="Select a video">
                    <Publish />
                </ImageUploadButton>
                <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                {
                    !this.state.loading ? (
                        <AppButton click={this.postVideoHandler} text="Upload video" image={false} />
                    ) : (
                        <Fragment>
                            <CircularProgress style={{ margin: '16px' }} />
                            <div className={styles.UploadPercentage}>Uploading - just a moment</div>
                        </Fragment>
                    )
                }
            </ModalLarge>
        </>
    }
}

export default AddVideo;