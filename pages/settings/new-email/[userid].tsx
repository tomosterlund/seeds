import React, { Fragment, useEffect, useState } from 'react'
import Layout from '../../../components/Layout/Layout'
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader'
import SeedButton from '../../../components/UI/SeedsButton/SeedButton'
import styles from './NewEmail.module.css'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import Axios from 'axios'
import { CircularProgress } from '@material-ui/core'

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

    const [success, setSuccess] = useState(false);
    const [ranOnce, setRanOnce] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const verified = await Axios.get(`/c-api/verify-new-email/${userId}`);
            console.log(verified);
            setRanOnce(true);
            return setSuccess(verified.data.updateWorked);
        }

        if (!ranOnce) {
            verifyEmail()
        }
    })

    return <>
        <Layout title="Confirm new email | Seeds">
            <div className={styles.NewEmailPage}>
                {ranOnce ? (
                    <Fragment>
                        <SeedsHeader text="All done!" />
                        <p>
                            Your new email address has been verified. Thanks for keeping us in the loop!
                        </p>
                        <SeedButton
                            text="take me someplace better"
                            image={false}
                            click={() => Router.push('/')}
                        />
                    </Fragment>
                ) : (
                    <CircularProgress style={{ margin: '32px 0 0 0' }} />
                )}

                {!success && ranOnce ? (
                    <h2>Something went wrong :/</h2>
                ) : null}
            </div>
        </Layout>
    </>
}

export default NewEmail;