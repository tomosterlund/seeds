import React, { useState } from 'react'
import Router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { setSessionUser } from './../../store/actions/sessionAction'
import { setLanguage } from './../../store/actions/setLanguage'
import Layout from './../../components/Layout/Layout'
import SeedsHeader from './../../components/Presentational/SeedsHeader/SeedsHeader'
import Textfield from './../../components/UI/Forms/Textfield/TextfieldFC'
import SeedsButton from './../../components/UI/SeedsButton/SeedButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './LoginPage.module.css'
import axios from 'axios'
import ModalNormal from '../../components/UI/Modals/ModalNormal/ModalNormal'
import Backdrop from '../../components/UI/Backdrop/Backdrop'
import SeedButton from './../../components/UI/SeedsButton/SeedButton'
import stateInterface from '../../interfaces/stateInterface'
import loginLang from '../../util/language/pages/login'
import Cookies from 'js-cookie'

const LoginPage: React.FC = () => {
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch();

    const loginHandler = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const loginAttempt = await axios.post('/c-api/login', { email, password });

            if (loginAttempt.data.loginError) {
                setLoading(false);

                switch (loginAttempt.data.loginError) {
                    case 'email':
                        setLoginError(loginLang[userLang].emailNotFound);
                        break;
                    case 'verification':
                        setLoginError(loginLang[userLang].notVerified);
                        break;
                    case 'pw':
                        setLoginError(loginLang[userLang].wrongPw);
                        break;
                }

                return setShowError(true);
            }

            dispatch(setSessionUser(loginAttempt.data.userData));
            dispatch(setLanguage(loginAttempt.data.userData.language));
            Cookies.set('seedsLanguage', loginAttempt.data.userData.language, { expires: 365 });
            setLoading(false);
            Router.push('/');
        } catch (error) {
        console.log(error);
        }
    }

    const goToPasswordReset = (event: any) => {
        event.preventDefault();
        Router.push('/login/forgot-password');
    }

    const goToRegister = (event: any) => {
        event.preventDefault();
        Router.push('/register');
    }

    return<>
        <Layout title={loginLang[userLang].pageTitle}>
            <form onSubmit={loginHandler} className={styles.LoginForm}>
                <div className={styles.LoginPage}>
                    <SeedsHeader text={loginLang[userLang].loginHdr} />
                    <Textfield
                    placeholder={loginLang[userLang].emailPh}
                    label={loginLang[userLang].emailInput}
                    inputValue={email}
                    inputType="email"
                    updateState={(event) => setEmail(event.currentTarget.value)}
                    />
                    <Textfield
                    placeholder={loginLang[userLang].passwordPh}
                    label={loginLang[userLang].passwordInput}
                    inputValue={password}
                    inputType="password"
                    updateState={(event) => setPassword(event.currentTarget.value)}
                    />
                    <div className={styles.OptionsContainer}>
                        <p
                            onClick={(event) => goToPasswordReset(event)}
                            className={styles.ForgotPassword}>
                                {loginLang[userLang].forgotPw}
                            </p>
                        
                        <p
                            onClick={(event) => goToRegister(event)}
                            className={styles.ForgotPassword}>
                                {loginLang[userLang].signUp}
                            </p>
                    </div>
                    {
                        !loading ? <SeedsButton image={true} text={loginLang[userLang].Btn} /> : <CircularProgress style={{ margin: '16px' }} />
                    }
                </div>
            </form>
            <ModalNormal show={showError} >
                <h2 style={{ margin: '0' }}>{loginLang[userLang].errorHdr}:</h2>
                <p>
                    {loginError}
                </p>
                <SeedButton click={() => setShowError(false)} text={loginLang[userLang].errorOk} image={true} />
            </ModalNormal>
            <Backdrop show={showError} toggle={() => setShowError(false)} />
        </Layout>
    </>
}

export default LoginPage;