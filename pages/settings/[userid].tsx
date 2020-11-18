import React, { Component } from 'react'
import styles from './settings.module.css'
import Layout from '../../components/Layout/Layout'
import stateInterface from '../../interfaces/stateInterface'
import { GetServerSideProps } from 'next'
import Axios from 'axios'
import { Sliders } from 'react-bootstrap-icons'

interface Props {
    name: string;
    imageUrl: string;
    email: string;
    password: string;
}

interface formInputState {
    value: string;
    valid: boolean;
}

interface State {
    name: formInputState;
    email: formInputState;
    password: formInputState;
    pwConfirm: formInputState;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const userId = ctx.params.userid;
    const user = await Axios.get(`http://localhost:3000/c-api/user/${userId}`);
    const userDoc = user.data.user;
    console.log(userDoc);

    return { props: {
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password,
        imageUrl: userDoc.imageUrl
    }}
}

class UserSettings extends Component<Props, State> {
    state = {
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
        selectedFile: null,
        file: '',
        imagePreviewUrl: '',
    }

    render() {
        return<>
            <Layout title="Account settings | Seeds">
                <div className={styles.SettingsPage}>
                    <h2>
                        <Sliders style={{ margin: '0 8px 0 0' }} />
                        Account settings
                    </h2>
                </div>
            </Layout>
        </>
    }
}

export default UserSettings;