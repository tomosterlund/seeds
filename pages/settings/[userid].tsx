import React, { Component, Fragment } from 'react'
import styles from './settings.module.css'
import Layout from '../../components/Layout/Layout'
import { GetServerSideProps } from 'next'
import Axios from 'axios'
import { Sliders } from 'react-bootstrap-icons'
import Textfield from '../../components/UI/Forms/Textfield/Textfield'
import ImageUploadButton from '../../components/UI/Forms/ImageUploadButton/ImageUploadButton'
import SeedButton from '../../components/UI/SeedsButton/SeedButton'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { setSessionUser } from './../../store/actions/sessionAction'
import { Build, Error } from '@material-ui/icons'
import ModalNormal from '../../components/UI/Modals/ModalNormal/ModalNormal'
import Backdrop from '../../components/UI/Backdrop/Backdrop'
import stateInterface from '../../interfaces/stateInterface'
import userSettingsLang from '../../util/language/user/account-settings'

interface Props {
    name: string;
    imageUrl: string;
    email: string;
    password: string;
    _id: string;
    dispatch: (user: any) => any;
    userLang: string;
}

interface formInputState {
    value: string;
    valid: boolean;
    showTextfield: boolean;
}

interface State {
    name: formInputState;
    email: formInputState;
    password: formInputState;
    pwConfirm: formInputState;
    selectedFile: any;
    file: any;
    imagePreviewUrl: any;
    loading: boolean;
    verificationDisclaimer: boolean;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const userId = ctx.params.userid;
    const user = await Axios.get(`http://localhost:3000/c-api/user/${userId}`);
    const userDoc = user.data.user;
    console.log(userDoc);

    return { props: {
        name: userDoc.name,
        email: userDoc.email,
        imageUrl: userDoc.imageUrl,
        _id: ctx.params.userid
    }}
}

class UserSettings extends Component<Props, State> {

    private fileInput: React.RefObject<HTMLInputElement>
    constructor(props) {
        super(props);
        this.fileInput = React.createRef<HTMLInputElement>();
    }

    state = {
        name: {
            value: this.props.name,
            valid: false,
            showTextfield: false
        },
        email: {
            value: this.props.email,
            valid: false,
            showTextfield: false
        },
        password: {
            value: '',
            valid: true,
            showTextfield: false
        },
        pwConfirm: {
            value: '',
            valid: false,
            showTextfield: false
        },
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
        loading: false,
        verificationDisclaimer: false
    }

    inputHandler = (event: any, fieldName: string) => {
        const newState = this.state;
        newState[fieldName].value = event.target.value;
        this.setState({ ...newState });
    }

    hideTextfields = () => {
        const newState = this.state;
        newState.name.showTextfield = false;
        newState.email.showTextfield = false;
        newState.password.showTextfield = false;
        newState.pwConfirm.showTextfield = false;
        this.setState({ ...newState });
    }

    openFilePicker = () => {
        this.fileInput.current.click();
    }

    getPhoto = (e: any) => {
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

    saveChanges = async () => {
        this.setState({ loading: true });
        const userObject = {
            name: this.state.name.value,
            email: this.state.email.value,
            password: this.state.password.value
        }

        if (this.state.password.value !== this.state.pwConfirm.value) {
            const newState = this.state;
            newState.password.valid = false;
            newState.loading = false;
            return this.setState({ ...newState });
        }

        if (this.state.password.value.length < 7 && this.state.password.showTextfield) {
            const newState = this.state;
            newState.password.valid = false;
            newState.loading = false;
            return this.setState({ ...newState });
        }

        try {
            const fd = new FormData();
            fd.append('userData', JSON.stringify(userObject));
            fd.append('image', this.state.selectedFile);
            const savedUser = await Axios.post(`/c-api/edit-user/${this.props._id}`, fd);
            this.setState({ loading: false });

            if (this.state.email.value !== this.props.email) {
                this.setState({ verificationDisclaimer: true });
            }

            this.props.dispatch(setSessionUser(savedUser.data.userData));
            this.hideTextfields();
        } catch (error) {
            console.log(error);
        }
    }

    toggleTextfield = (fieldName: string) => {
        const newState = this.state;
        newState[fieldName].showTextfield = !newState[fieldName].showTextfield;
        this.setState({ ...newState });
    }

    togglePWModal = () => {
        const newState = this.state;
        newState.password.valid = true;
        this.setState({ ...newState });
    }

    render() {
        return<>
            <Layout title={userSettingsLang[this.props.userLang].pageTitle}>
                <div className={styles.SettingsPage}>
                    <h2>
                        <Sliders style={{ margin: '0 8px 0 0' }} />
                        {userSettingsLang[this.props.userLang].title}
                    </h2>

                    {this.state.name.showTextfield ? (
                        <Textfield
                            placeholder={userSettingsLang[this.props.userLang].namePlaceholder}
                            label={userSettingsLang[this.props.userLang].name}
                            inputType="text"
                            inputValue={this.state.name.value}
                            fieldName="name"
                            changeHandler={this.inputHandler}
                        />
                    ) : (
                        <Fragment>
                            <div className={styles.DetailContainer}>
                                <p>{userSettingsLang[this.props.userLang].name}: {this.state.name.value}</p>
                                <div
                                    onClick={() => this.toggleTextfield('name')}
                                    className={styles.BuildIcon}
                                >
                                    <Build fontSize="small" style={{ margin: '0 0 0 8px' }} />
                                </div>
                            </div>
                        </Fragment>
                    )}

                    {this.state.email.showTextfield ? (
                        <Textfield
                            placeholder={userSettingsLang[this.props.userLang].emailPlaceholder}
                            label={userSettingsLang[this.props.userLang].email}
                            inputType="email"
                            inputValue={this.state.email.value}
                            fieldName="email"
                            changeHandler={this.inputHandler}
                        />
                    ) : (
                        <Fragment>
                            <div className={styles.DetailContainer}>
                                <p>{userSettingsLang[this.props.userLang].email}: {this.state.email.value}</p>
                                <div
                                    onClick={() => this.toggleTextfield('email')}
                                    className={styles.BuildIcon}
                                >
                                    <Build fontSize="small" style={{ margin: '0 0 0 8px' }} />
                                </div>
                            </div>
                        </Fragment>
                    )}

                    {this.state.password.showTextfield ? (
                        <Fragment>
                            <Textfield
                                placeholder={userSettingsLang[this.props.userLang].passwordPlaceholder}
                                label={userSettingsLang[this.props.userLang].password}
                                inputType="password"
                                inputValue={this.state.password.value}
                                fieldName="password"
                                changeHandler={this.inputHandler}
                            />

                            <Textfield
                                placeholder={userSettingsLang[this.props.userLang].pwConfirmPlaceholder}
                                label={userSettingsLang[this.props.userLang].pwConfirm}
                                inputType="password"
                                inputValue={this.state.pwConfirm.value}
                                fieldName="pwConfirm"
                                changeHandler={this.inputHandler}
                            />

                        </Fragment>
                    ) : (
                        <Fragment>
                            <div className={styles.DetailContainer}>
                                <p>{userSettingsLang[this.props.userLang].password}: *********</p>
                                <div
                                    onClick={() => this.toggleTextfield('password')}
                                    className={styles.BuildIcon}
                                >
                                    <Build fontSize="small" style={{ margin: '0 0 0 8px' }} />
                                </div>
                            </div>
                        </Fragment>
                    )}

                    <ImageUploadButton
                        camera={true}
                        text={userSettingsLang[this.props.userLang].newImage}
                        openFileHandler={this.openFilePicker}
                        chosenImage={this.state.file}
                    />
                    <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />

                    {!this.state.loading ? (
                        <SeedButton
                            text={userSettingsLang[this.props.userLang].save}
                            image={false}
                            click={this.saveChanges}
                        />
                    ) : <CircularProgress style={{ margin: '16px 0 0 0' }} />}

                </div>

                <ModalNormal show={!this.state.password.valid}>
                        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center' }}>
                            <Error fontSize="small" style={{ margin: '0 8px 0 0' }} />
                            <p style={{ textAlign: 'center' }}>Passwords do not match/password is too short. Please choose a password of at least 7 characters.</p>
                        </div>
                </ModalNormal>
                <Backdrop toggle={ this.togglePWModal } show={!this.state.password.valid} />

                <ModalNormal show={this.state.verificationDisclaimer}>
                    <h4>{userSettingsLang[this.props.userLang].goVerifyHdr}</h4>
                    <p style={{ margin: '8px 0', textAlign: 'center' }}>
                        {userSettingsLang[this.props.userLang].goVerifyTxt}
                    </p>
                    <p style={{ margin: '8px 0', fontStyle: 'italic', fontSize: '12px', textAlign: 'center' }}>
                        {userSettingsLang[this.props.userLang].goVerifyTxt2}
                    </p>

                    <SeedButton
                        text={userSettingsLang[this.props.userLang].goVerifyBtn}
                        image={false}
                        click={() => this.setState({ verificationDisclaimer: false })}
                    />
                </ModalNormal>
                <Backdrop toggle={() => this.setState({ verificationDisclaimer: false })} show={this.state.verificationDisclaimer} />
            </Layout>
        </>
    }
}

const mapStateToProps = (state: stateInterface) => ({
    userLang: state.languageReducer.language
  });

export default connect(mapStateToProps)(UserSettings);