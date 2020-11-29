import { WarningRounded } from '@material-ui/icons';
import React from 'react'
import Layout from '../../../components/Layout/Layout';
import SeedsHeader from '../../../components/Presentational/SeedsHeader/SeedsHeader';
import styles from './ReportIssue.module.css'

const ReportIssue: React.FC = () => {
    return<>
        <Layout title="Report issue | Seeds">
            <div className={styles.ReportIssuesPage}>
                <div className={styles.PageHeader}>
                    <WarningRounded
                        className={styles.WarningIcon}
                        fontSize="small"
                    />
                    Report an issue
                </div>
            </div>
        </Layout>
    </>
}

export default ReportIssue;