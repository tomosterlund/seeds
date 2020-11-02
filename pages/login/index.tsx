import React, { useState } from 'react'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import { setSessionUser } from './../../store/actions/sessionAction'
import Layout from './../../components/Layout/Layout'
import SeedsHeader from './../../components/Presentational/SeedsHeader/SeedsHeader'
import Textfield from './../../components/UI/Forms/Textfield/TextfieldFC'
import SeedsButton from './../../components/UI/SeedsButton/SeedButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './LoginPage.module.css'
import axios from 'axios'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const loginHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const loginAttempt = await axios.post('/c-api/login', { email, password });
            console.log(loginAttempt);
            dispatch(setSessionUser(loginAttempt.data.userData));
            setLoading(false);
            Router.push('/');
        } catch (error) {
        console.log(error);
        }
    }

    return<>
        <Layout title ="Login | Seeds">
            <form onSubmit={loginHandler} className={styles.LoginForm}>
                <div className={styles.LoginPage}>
                    <SeedsHeader text="Sign in" />
                    <Textfield
                    placeholder="Enter your e-mail"
                    label="E-mail"
                    inputValue={email}
                    inputType="email"
                    updateState={(event) => setEmail(event.currentTarget.value)}
                    />
                    <Textfield
                    placeholder="Enter your password"
                    label="Password"
                    inputValue={password}
                    inputType="password"
                    updateState={(event) => setPassword(event.currentTarget.value)}
                    />
                    {
                        !loading ? <SeedsButton image={true} text="Enter" /> : <CircularProgress style={{ margin: '16px' }} />
                    }
                </div>
            </form>
        </Layout>
    </>
}

export default LoginPage;