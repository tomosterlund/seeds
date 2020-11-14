import React, { Component } from "react";
import SeedsHeader from "../../../Presentational/SeedsHeader/SeedsHeader";
import ImageUploadButton from "../../../UI/Forms/ImageUploadButton/ImageUploadButton";
import Textfield from "../../../UI/Forms/Textfield/Textfield";
import ModalLarge from "../../../UI/Modals/LargeModal/LargeModal";
import SeedButton from "../../../UI/SeedsButton/SeedButton";
import axios from 'axios'
import Router from "next/router";
import { CircularProgress } from "@material-ui/core";

interface Props {
    show: boolean;
    courseId: string;
    close: () => void;
}

interface State {
    courseTitle: string;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
}

class CourseSettings extends Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        courseTitle: '',
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
        loading: false
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

    textInputHandler = (event: any, fieldName: string) => {
        const targetValue = event.target.value;
        const newState = this.state;
        newState[fieldName] = targetValue;
        this.setState({ ...newState });
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
                <SeedsHeader text="Edit course" />
                <Textfield
                    label="Title"
                    placeholder="Enter a course title"
                    inputValue={this.state.courseTitle}
                    inputType="text"
                    changeHandler={this.textInputHandler}
                    fieldName="courseTitle"
                />
                <ImageUploadButton
                    openFileHandler={this.openFilePicker}
                    text="Change image"
                    camera={true}
                    chosenImage={this.state.file}
                />
                <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                {!this.state.loading ? (
                    <SeedButton click={this.saveChanges} text="save changes" image={false} />
                ) : (
                    <CircularProgress style={{ margin: '8px 0 0 0' }} />
                )}
            </ModalLarge>
        </>
    }
}

export default CourseSettings;