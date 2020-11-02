import PropTypes from 'prop-types';
import React from 'react'
import styles from './ModalMini.module.css'

interface Props {
    children: PropTypes.ReactNodeLike;
    show: boolean;
}

const ModalMini: React.FC<Props> = ({ children, show }) => {
    return<>
        <div className={show ? [styles.ModalMini, styles.Show].join(' ') : [styles.ModalMini, styles.Hide].join(' ')}>
            {children}
        </div>
    </>
}

export default ModalMini;