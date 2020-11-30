import { WarningRounded } from '@material-ui/icons';
import Axios from 'axios';
import { report } from 'process';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Layout from '../../../components/Layout/Layout';
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader';
import Select from '../../../components/UI/Forms/Select/Select';
import Textfield from '../../../components/UI/Forms/Textfield/TextfieldFC';
import SeedButton from '../../../components/UI/SeedsButton/SeedButton';
import stateInterface from '../../../interfaces/stateInterface';
import reportIssueLang from '../../../util/language/pages/contact/report-issue';
import styles from './ReportIssue.module.css'

const ReportIssue: React.FC = () => {
    const sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [emailVal, setEmailVal] = useState('');
    const [browser, setBrowser] = useState('Google Chrome');
    const [issueTxt, setIssueTxt] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentIssue, setSentIssue] = useState(false);

    useEffect(() => {
        const email = sessionUser ? sessionUser.email : 'your@gmail.com';
        setEmailVal(email);
    }, []);

    const submitIssue = async () => {
        console.log('submitted issue');
        setSentIssue(true);
        const d = {
            email: emailVal,
            browser: browser,
            issue: issueTxt
        }

        try {
            const filedIssue = await Axios.post('/c-api/issue-report', d);
            console.log(filedIssue);
        } catch (error) {
            console.log(error);
        }
    }

    const changeSelectVal = (event: any, fieldName: string) => {
        setBrowser(event.target.value)
    }

    let pageBody;
    if (!sentIssue) { pageBody = (
        <Fragment>
            <div className={styles.PageHeader}>
                <WarningRounded
                    className={styles.WarningIcon}
                    fontSize="small"
                />
                {reportIssueLang[userLang].hdr}
            </div>

            <Textfield
                inputValue={emailVal}
                inputType="text"
                label={reportIssueLang[userLang].email}
                placeholder={reportIssueLang[userLang].emailPh}
                updateState={(event) => setEmailVal(event.target.value)}
            />

            <Select
                label={reportIssueLang[userLang].browser}
                inputValue={browser}
                fieldName="select"
                changeHandler={changeSelectVal}
                optionsArr={reportIssueLang[userLang].optionsArr}       
            />

            <div className={styles.InputContainer}>
                <label>{reportIssueLang[userLang].describe}</label>
                <textarea
                    cols={41}
                    rows={5}
                    onChange={(event) => setIssueTxt(event.target.value)}
                />
            </div>

            <SeedButton
                text={reportIssueLang[userLang].btn}
                image={false}
                click={submitIssue}
            />
        </Fragment>
    )} else if (sentIssue) { pageBody = (
        <Fragment>
            <SeedsHeader
                text={reportIssueLang[userLang].thanksHdr}
            />

            <p>
                {reportIssueLang[userLang].thanksTxt}
            </p>
        </Fragment>
    )}

    return<>
            <Layout title={reportIssueLang[userLang].pageTitle}>
            <div className={styles.ReportIssuesPage}>
                {pageBody}
            </div>
        </Layout>
    </>
}

export default ReportIssue;