import React from 'react'
import styles from './FloatingButton.module.css'

interface Props {
    backgroundColor: string;
    click: () => void;
}

const FloatingButton: React.FC<Props> = ({ backgroundColor, children, click }) => {
    return<>
        <div
            className={styles.FloatingButton}
            style={{ backgroundColor }}
            onClick={click}
        >
            {children}
        </div>
    </>
}

export default FloatingButton;