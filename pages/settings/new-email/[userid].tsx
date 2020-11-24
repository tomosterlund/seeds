import React, { Fragment, useEffect, useState } from 'react'
import Layout from '../../../components/Layout/Layout'
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader'
import SeedButton from '../../../components/UI/SeedsButton/SeedButton'
import styles from './NewEmail.module.css'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import Axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import stateInterface from '../../../interfaces/stateInterface'
import newEmailLang from '../../../util/language/user/new-email'

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const userId = ctx.params.userid;

    return {
        props: {
            userId
        }
    }
}

interface Props {
    userId: string;
}

const NewEmail: React.FC<Props> = ({ userId }) => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [success, setSuccess] = useState(false);
    const [ranOnce, setRanOnce] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const verified = await Axios.get(`/c-api/verify-new-email/${userId}`);
            console.log(verified);
            setSuccess(verified.data.updateWorked);
            return setRanOnce(true);
        }

        if (!ranOnce) {
            verifyEmail()
        }
    }, [])

    return <>
        <Layout title={newEmailLang[userLang].pageTitle}>
            <div className={styles.NewEmailPage}>
                {ranOnce && success ? (
                    <Fragment>
                        <SeedsHeader text={newEmailLang[userLang].hdr} />
                        <p>
                            {newEmailLang[userLang].txt}
                        </p>
                        <SeedButton
                            text={newEmailLang[userLang].btn}
                            image={false}
                            click={() => Router.push('/')}
                        />
                    </Fragment>
                ) : (
                    <CircularProgress style={{ margin: '32px 0 0 0' }} />
                )}

                {!success && ranOnce ? (
                    <h2>{newEmailLang[userLang].err}</h2>
                ) : null}
            </div>
        </Layout>
    </>
}

export default NewEmail;