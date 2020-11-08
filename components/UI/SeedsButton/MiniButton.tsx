import React from 'react'
import styles from './MiniButton.module.css'

interface Props {
    text: string;
    click?: () => void;
}

const MiniButton: React.FC<Props> = ({ text, children, click }) => {
    return<>
        <div>
            <button onClick={click} className={styles.MiniButton}>
                {children}
                {text}
            </button>
        </div>
    </>
}

export default MiniButton;