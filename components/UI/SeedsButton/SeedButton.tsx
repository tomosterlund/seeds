import React from 'react'
import styles from './SeedButton.module.css'

interface Props {
    click?: () => void;
    text: String;
    image: boolean;
    backgroundColor?: string;
}

const SeedButton: React.FC<Props> = ({ click, text, image, children, backgroundColor }) => {
    return<>
        <button style={backgroundColor === 'red' ? {backgroundColor: '#ffb1ae'} : null } onClick={click} className={styles.Button}>
            {children}
            {image ? <img className={styles.SeedingSVG} style={{ margin: '0 8px 0 0' }} src="./assets/images/seedingGreen.svg" /> : null}
            <p>{text}</p>
        </button>
    </>
}

export default SeedButton;