import React from 'react'
import styles from './LargeModal.module.css'

interface Props {
    show: boolean;
}

const ModalLarge: React.FC<Props> = ({ show, children }) => {
    return<>
        <div className={show ? [styles.ModalLarge, styles.Show].join(' ') : [styles.ModalLarge, styles.Hide].join(' ')}>
            { children }
        </div>
    </>
}

export default ModalLarge;