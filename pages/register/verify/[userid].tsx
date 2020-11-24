import React, { Fragment, useEffect, useState } from 'react'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import Layout from '../../../components/Layout/Layout';
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader';
import SeedButton from '../../../components/UI/SeedsButton/SeedButton';
import styles from './verify.module.css'
import Axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import stateInterface from '../../../interfaces/stateInterface';
import verifyUserLang from '../../../util/language/pages/verify-user';

interface Props {
    userIdProp: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const userId = ctx.params.userid;

    return {
        props: {
            userIdProp: userId
        }
    }
}

const VerifyUser: React.FC<Props> = ({userIdProp}) => {
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [loading, setLoading] = useState(false);
    const [verificationDone, setVerificationDone] = useState(false);
    const [verificationError, setVerificationError] = useState(false);

    useEffect(() => {
        if (!verificationDone && !verificationError) {
            setLoading(true);

            const verifyUser = async () => {
                const verified = await Axios.post(`/c-api/verify/${userIdProp}`);

                if (!verified.data.success) {
                    setLoading(false);
                    return setVerificationError(true);
                }

                if (verified.data.success) {
                    setLoading(false);
                    return setVerificationDone(true);
                }
            }

            verifyUser();
        }
    })

    return<>
        <Layout title={verifyUserLang[userLang].pageTitle}>
            <div className={styles.Verify}>
                {verificationDone ? (
                    <Fragment>
                        <SeedsHeader text={verifyUserLang[userLang].hdr} />
                        <p>
                            {verifyUserLang[userLang].txt}
                        </p>
                        <SeedButton
                            text={verifyUserLang[userLang].btn}
                            image={false}
                            click={() => Router.push('/login')}
                        />
                    </Fragment>
                ) : null}

                {verificationError ? (
                    <Fragment>
                        <SeedsHeader text={verifyUserLang[userLang].errHdr} />
                        <p>
                            {verifyUserLang[userLang].errTxt}
                        </p>
                        <SeedButton
                            text={verifyUserLang[userLang].errBtn}
                            image={false}
                            click={() => Router.push('/login')}
                        />
                    </Fragment>
                ) : null}

                {loading ? <CircularProgress style={{ margin: '32px' }} /> : null}
            </div>
        </Layout>
    </>
}

export default VerifyUser;