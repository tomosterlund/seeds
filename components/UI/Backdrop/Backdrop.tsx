import React from 'react'
import styles from './Backdrop.module.css'

interface Props {
    show: Boolean;
    toggle: () => void;
}

const Backdrop: React.FC<Props> = ({ show, toggle }) => {
    return<>
        {
            show ? <div onClick={toggle} className={styles.Backdrop} /> : null    
        }
    </>
}

export default Backdrop;