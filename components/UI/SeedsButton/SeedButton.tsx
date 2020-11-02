import React from 'react'
import styles from './SeedButton.module.css'

interface Props {
    click?: () => void;
    text: String;
    image: boolean;
}

const SeedButton: React.FC<Props> = ({ click, text, image, children }) => {
    return<>
        <button onClick={click} className={styles.Button}>
            {children}
            {image ? <img className={styles.SeedingSVG} style={{ margin: '0 8px 0 0' }} src="./assets/images/seedingGreen.svg" /> : null}
            <p>{text}</p>
        </button>
    </>
}

export default SeedButton;