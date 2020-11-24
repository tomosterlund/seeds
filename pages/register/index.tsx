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
import stateInterface from '../../interfaces/stateInterface'
import { connect } from 'react-redux'
import registrationLang from '../../util/language/pages/registration'

interface Props {
    userLang: string;
}

class Register extends Component<Props> {
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
            this.props.userLang
        )
        if (formValidation.length !== 0) {
            return this.setState({ formErrors: formValidation });
        }

        this.setState({ loading: true });
        const userData = {
            name: this.state.newUser.name.value,
            email: this.state.newUser.email.value,
            password: this.state.newUser.password.value,
            lang: this.props.userLang
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
            <Layout title={registrationLang[this.props.userLang].pageTitle}>
                <div className={styles.RegistrationPage}>
                    <RegistrationGreeting />
                    <form encType="multipart/form-data" className={styles.Form} onSubmit={this.registrationHandler}>
                        <SeedsHeader text={registrationLang[this.props.userLang].registerHdr} />
                        <Textfield
                        inputValue={this.state.newUser.name.value}
                        label={registrationLang[this.props.userLang].nameInput}
                        inputType="text"
                        placeholder={registrationLang[this.props.userLang].namePh}
                        fieldName="name"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.email.value}
                        label={registrationLang[this.props.userLang].emailInput}
                        inputType="email"
                        placeholder={registrationLang[this.props.userLang].emailPh}
                        fieldName="email"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.password.value}
                        label={registrationLang[this.props.userLang].passwordInput}
                        inputType="password"
                        placeholder={registrationLang[this.props.userLang].passwordPh}
                        fieldName="password"
                        changeHandler={this.inputChangeHandler}
                        />
                        <Textfield
                        inputValue={this.state.newUser.pwConfirm.value}
                        label={registrationLang[this.props.userLang].pwConfirmInput}
                        inputType="password"
                        placeholder={registrationLang[this.props.userLang].pwConfirmPh}
                        fieldName="pwConfirm"
                        changeHandler={this.inputChangeHandler}
                        />
                        <ImageUploadButton camera={true} text={registrationLang[this.props.userLang].imageUpload} chosenImage={this.state.file} openFileHandler={this.openFilePicker} />
                        <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                        {
                            !this.state.loading ? <SeedsButton image={true} text={registrationLang[this.props.userLang].joinBtn} /> : <CircularProgress color="primary" style={{ margin: '16px' }} />
                        }
                    </form>
                    {this.state.showModal ? (
                        <Fragment>
                            <ModalNormal show={this.state.showModal}>
                                <SeedsHeader text={registrationLang[this.props.userLang].verificationHdr} />
                                <p>
                                    {registrationLang[this.props.userLang].verificationTxt}
                                </p>
                                <SeedButton text={registrationLang[this.props.userLang].verificationBtn} image={true} click={this.hideModal} />
                            </ModalNormal>
                            <Backdrop show={this.state.showModal} toggle={this.hideModal} />
                        </Fragment>
                    ) : null}

                    <ModalNormal show={!this.state.correctMimetype}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Error style={{ margin: '0 6px 0 0' }} />
                            <h2 style={{ fontSize: '16px' }}>{registrationLang[this.props.userLang].fileErrorHdr}</h2>
                        </div>
                        <p>{registrationLang[this.props.userLang].fileErrorTxt}:</p>
                        <ul className={styles.FormatList}>
                            <li>.jpg</li>
                            <li>.png</li>
                            <li>.gif</li>
                        </ul>
                        <SeedButton
                            text={registrationLang[this.props.userLang].fileErrorBtn}
                            image={false}
                            click={this.dumpChosenFile}
                        />
                    </ModalNormal>
                    <Backdrop toggle={this.dumpChosenFile} show={!this.state.correctMimetype} />

                    <ModalNormal show={this.state.formErrors.length !== 0}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Error style={{ margin: '0 6px 0 0' }} />
                            <h2 style={{ fontSize: '16px' }}>{registrationLang[this.props.userLang].validationErrHdr}:</h2>
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
                            text={registrationLang[this.props.userLang].validationErrBtn}
                            image={false}
                        />
                    </ModalNormal>
                    <Backdrop show={this.state.formErrors.length !== 0} toggle={this.closeValidationErrors} />
                </div>
            </Layout>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language
})

export default connect(mapStateToProps)(Register);