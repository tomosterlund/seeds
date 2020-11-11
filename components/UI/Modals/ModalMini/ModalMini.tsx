import PropTypes from 'prop-types';
import React from 'react'
import { Right } from 'react-bootstrap/lib/Media';
import styles from './ModalMini.module.css'

interface Props {
    children: PropTypes.ReactNodeLike;
    show: boolean;
    position: 'right' | 'left';
}

const ModalMini: React.FC<Props> = ({ children, show, position }) => {
    return<>
        <div
        className={show ? [styles.ModalMini, styles.Show].join(' ') : [styles.ModalMini, styles.Hide].join(' ')}
        style={position === 'right' ? { right: '0' } : { left: '0' }}
        >
            {children}
        </div>
    </>
}

export default ModalMini;