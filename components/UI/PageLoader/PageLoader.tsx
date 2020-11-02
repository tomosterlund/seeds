import { CircularProgress } from '@material-ui/core'
import React from 'react'
import styles from './PageLoader.module.css'

interface Props {}

const PageLoader: React.FC<Props> = ({}) => {
    return<>
        <div className={styles.PageLoaderWrapper}>
            <div className={styles.Progress}>
                <CircularProgress />
            </div>
        </div>
    </>
}

export default PageLoader;