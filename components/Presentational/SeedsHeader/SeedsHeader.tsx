import React from 'react'
import styles from './SeedsHeader.module.css'

interface Props {
    text: String;
}

const SeedsHeader: React.FC<Props> = ({ text }) => {
    return<>
        <div className={styles.SeedsHeader}>
            <img className={styles.SproutIMG} src="/assets/images/HandSprout.svg" />
            <h2>{text}</h2>
        </div>
    </>
}

export default SeedsHeader;