import React, { Component } from 'react'
import Router from 'next/router'
import styles from './register.module.css'
import Layout from './../../components/Layout/Layout'
import RegistrationGreeting from './../../components/Presentational/RegistrationGreeting/RegistrationGreeting'
import SeedsHeader from './../../components/Presentational/SeedsHeader/SeedsHeader'
import SeedsButton from './../../components/UI/SeedsButton/SeedButton'
import Textfield from './../../components/UI/Forms/Textfield/Textfield'
import CircularProgress from '@material-ui/core/CircularProgress'
import ImageUploadButton from './../../components/UI/Forms/ImageUploadButton/ImageUploadButton'
import axios from 'axios'

class Register extends Component {
    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        newUser: {
            name: {
                value: '',
                valid: false
            },
            email: {
                value: '',
                valid: false
            },
            password: {
                value: '',
                valid: false
            },
            pwConfirm: {
                value: '',
                valid: false
            },
        },
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

    inputChangeHandler = (event, fieldName) => {
        let newState = this.state;
        newState.newUser[fieldName].value = event.target.value;
        this.setState({ ...newState });
    }

    registrationHandler = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const userData = {
            name: this.state.newUser.name.value,
            email: this.state.newUser.email.value,
            password: this.state.newUser.password.value
        }
        const stringifiedUser = JSON.stringify(userData);
        console.log(stringifiedUser);
        try {
            let fd = new FormData();
            fd.append('image', this.state.selectedFile);
            fd.append('userData', stringifiedUser);
            const postedUser = await axios.post('/c-api/register', fd);
            console.log(postedUser);
            this.setState({ loading: false });
            Router.push('/login');
            
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return<>
            <Layout title="Register | Seeds">
                <div className={styles.RegistrationPage}>
                    <RegistrationGreeting />
                    <form encType="multipart/form-data" className={styles.Form} onSubmit={this.registrationHandler}>
                        <SeedsHeader text="Register" />
                        <Textfield
                        inputValue={this.state.newUser.name.value}
                        label="Name"
                        inputType="text"
                        placeholder="Type your name"
                        fieldName="name"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.email.value}
                        label="E-mail"
                        inputType="email"
                        placeholder="Type your e-mail address"
                        fieldName="email"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.password.value}
                        label="Password"
                        inputType="password"
                        placeholder="Choose a password"
                        fieldName="password"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.pwConfirm.value}
                        label="Confirm password"
                        inputType="password"
                        placeholder="Type your password again"
                        fieldName="pwConfirm"
                        changeHandler={this.inputChangeHandler}
                        />
                        <ImageUploadButton camera={true} text="Upload image" chosenImage={this.state.file} openFileHandler={this.openFilePicker} />
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {
                            !this.state.loading ? <SeedsButton image={true} text="Join now" /> : <CircularProgress color="primary" style={{ margin: '16px' }} />
                        }
                    </form>
                </div>
            </Layout>
        </>
    }
}

export default Register;