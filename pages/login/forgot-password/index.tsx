import { CircularProgress } from '@material-ui/core'
import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../../components/Layout/Layout'
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader'
import Backdrop from '../../../components/UI/Backdrop/Backdrop'
import Textfield from '../../../components/UI/Forms/Textfield/TextfieldFC'
import ModalNormal from '../../../components/UI/Modals/ModalNormal/ModalNormal'
import SeedButton from '../../../components/UI/SeedsButton/SeedButton'
import stateInterface from '../../../interfaces/stateInterface'
import forgotPwLang from '../../../util/language/pages/forgot-password'
import styles from './ForgotPassword.module.css'

const ForgotPassword: React.FC = () => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetPassword = async () => {
        setLoading(true);
        try {
            const pwReset = await Axios.post('/c-api/reset-password', { email: email });
            console.log(pwReset);
            setShowModal(true);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return<>
        <Layout title={forgotPwLang[userLang].pageTitle}>
            <div className={styles.ForgotPasswordPage}>
                <SeedsHeader text={forgotPwLang[userLang].hdr} />
                <p className={styles.Paragraph}>
                    {forgotPwLang[userLang].text1}
                </p>
                <p className={styles.Paragraph}>
                    {forgotPwLang[userLang].text2}
                </p>
                <Textfield
                    label={forgotPwLang[userLang].emailInput}
                    placeholder={forgotPwLang[userLang].emailPh}
                    inputValue={email}
                    inputType="text"
                    updateState={(event) => setEmail(event.target.value)}
                />

                {!loading ? (
                    <SeedButton
                        text={forgotPwLang[userLang].doneBtn}
                        image={false}
                        click={resetPassword}
                    />
                ) : <CircularProgress style={{ margin: '0 32px 0 0' }} />}
                
                <ModalNormal show={showModal}>
                    <h2 className={styles.VerificationHdr}>{forgotPwLang[userLang].verificationHdr}</h2>
                    <p>{forgotPwLang[userLang].verificationTxt}</p>
                    <img src="/assets/images/sent.png" alt="Email" />
                </ModalNormal>
                <Backdrop show={showModal} toggle={() => setShowModal(false)} />
            </div>
        </Layout>
    </>
}

export default ForgotPassword;