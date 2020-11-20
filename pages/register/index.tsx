import React, { Component, Fragment } from 'react'
import styles from './register.module.css'
import Layout from './../../components/Layout/Layout'
import RegistrationGreeting from './../../components/Presentational/RegistrationGreeting/RegistrationGreeting'
import SeedsHeader from './../../components/Presentational/SeedsHeader/SeedsHeader'
import SeedsButton from './../../components/UI/SeedsButton/SeedButton'
import Textfield from './../../components/UI/Forms/Textfield/Textfield'
import CircularProgress from '@material-ui/core/CircularProgress'
import ImageUploadButton from './../../components/UI/Forms/ImageUploadButton/ImageUploadButton'
import axios from 'axios'
import ModalNormal from '../../components/UI/Modals/ModalNormal/ModalNormal'
import SeedButton from './../../components/UI/SeedsButton/SeedButton'
import Backdrop from '../../components/UI/Backdrop/Backdrop'
import { checkFileFormat } from './../../util/form-validation/file-format'
import { Error } from '@material-ui/icons'
import { validateRegistration } from './validateRegistration'

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
        loading: false,
        showModal: false,
        correctMimetype: true,
        formErrors: []
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

        const mimetypeCheck = checkFileFormat(file.name, ['jpg', 'png', 'gif']);
        if (!mimetypeCheck) {
            this.setState({ correctMimetype: false });
        } else if (mimetypeCheck) {
            this.setState({ correctMimetype: true });
        }
    }

    inputChangeHandler = (event, fieldName) => {
        let newState = this.state;
        newState.newUser[fieldName].value = event.target.value;
        this.setState({ ...newState });
    }

    registrationHandler = async (event) => {
        event.preventDefault();

        // Form validation
        const formValidation = validateRegistration(
            this.state.newUser.name.value,
            this.state.newUser.email.value,
            this.state.newUser.password.value,
            this.state.newUser.pwConfirm.value,
        )
        if (formValidation.length !== 0) {
            return this.setState({ formErrors: formValidation });
        }

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
            const resetUser = {
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
            }
            this.setState({ newUser: resetUser });
            this.setState({ loading: false });
            this.setState({ showModal: true });
        } catch (error) {
            console.log(error);
        }
    }

    hideModal = () => {
        this.setState({ showModal: false });
    }

    dumpChosenFile = () => {
        this.setState({
            selectedFile: null,
            file: '',
            imagePreviewUrl: '',
            correctMimetype: true
        });
    }

    closeValidationErrors = () => {
        this.setState({ formErrors: [] });
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
                    {this.state.showModal ? (
                        <Fragment>
                            <ModalNormal show={this.state.showModal}>
                                <SeedsHeader text="Yay! Good call" />
                                <p>
                                    Now just one more step. Go to your email and click the link you received from us to finish your registration.
                                </p>
                                <SeedButton text="got it" image={true} click={this.hideModal} />
                            </ModalNormal>
                            <Backdrop show={this.state.showModal} toggle={this.hideModal} />
                        </Fragment>
                    ) : null}

                    <ModalNormal show={!this.state.correctMimetype}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Error style={{ margin: '0 6px 0 0' }} />
                            <h2 style={{ fontSize: '16px' }}>File type not supported</h2>
                        </div>
                        <p>You can upload images with the following formats:</p>
                        <ul className={styles.FormatList}>
                            <li>.jpg</li>
                            <li>.png</li>
                            <li>.gif</li>
                        </ul>
                        <SeedButton
                            text="ok, got it!"
                            image={false}
                            click={this.dumpChosenFile}
                        />
                    </ModalNormal>
                    <Backdrop toggle={this.dumpChosenFile} show={!this.state.correctMimetype} />

                    <ModalNormal show={this.state.formErrors.length !== 0}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Error style={{ margin: '0 6px 0 0' }} />
                            <h2 style={{ fontSize: '16px' }}>Validation errors:</h2>
                        </div>
                        <ul className={styles.FormatList}>
                            {this.state.formErrors.map((e, i) => (
                                <li key={i}>
                                    {e}
                                </li>
                            ))}
                        </ul>
                        <SeedButton
                            click={this.closeValidationErrors}
                            text="ok, got it!"
                            image={false}
                        />
                    </ModalNormal>
                    <Backdrop show={this.state.formErrors.length !== 0} toggle={this.closeValidationErrors} />
                </div>
            </Layout>
        </>
    }
}

export default Register;