import React from 'react'
import styles from './ModalNormal.module.css'

interface Props {
    show: boolean;
}

const ModalNormal: React.FC<Props> = ({ children, show }) => {
    return<>
        <div className={show ? [styles.ModalNormal, styles.Show].join(' ') : [styles.ModalNormal, styles.Hide].join(' ')}>
            { children }
        </div>
    </>
}

export default ModalNormal;