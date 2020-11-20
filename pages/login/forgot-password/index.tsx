import React, { useState } from 'react'
import Layout from '../../../components/Layout/Layout'
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader'
import Backdrop from '../../../components/UI/Backdrop/Backdrop'
import Textfield from '../../../components/UI/Forms/Textfield/TextfieldFC'
import ModalNormal from '../../../components/UI/Modals/ModalNormal/ModalNormal'
import SeedButton from '../../../components/UI/SeedsButton/SeedButton'
import styles from './ForgotPassword.module.css'

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    return<>
        <Layout title="Forgot password | Seeds">
            <div className={styles.ForgotPasswordPage}>
                <SeedsHeader text="Reset user password" />
                <p className={styles.Paragraph}>
                    Forgot your password? No worries!
                </p>
                <p className={styles.Paragraph}>
                    Just enter your email here, and we will send you instructions on how to reset your password.
                </p>
                <Textfield
                    label="Email"
                    placeholder="your@email.com"
                    inputValue={email}
                    inputType="text"
                    updateState={(event) => setEmail(event.target.value)}
                />

                <SeedButton
                    text="Reset password"
                    image={false}
                    click={() => setShowModal(true)}
                />
                
                <ModalNormal show={showModal}>
                    <h2>Help is on the way!</h2>
                    <p>Check your email</p>
                    <img src="/assets/images/sent.png" alt="Email" />
                </ModalNormal>
                <Backdrop show={showModal} toggle={() => setShowModal(false)} />
            </div>
        </Layout>
    </>
}

export default ForgotPassword;