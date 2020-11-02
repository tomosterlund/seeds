import React from 'react'
import styles from './Textfield.module.css'

interface Props {
    placeholder: string;
    label?: string;
    inputValue: string;
    inputType: string;
    updateState: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

const TextfieldMini: React.FC<Props> = ({ placeholder, label, inputValue, inputType, updateState }) => {
    return<>
        <div className={styles.TextfieldContainer}>
            {
                label ? <label>{label}</label> : null
            }
            <input
            value={inputValue}
            placeholder={placeholder}
            type={inputType}
            onChange={updateState}
            style={{ width: '100%' }}
            />
        </div>
    </>
}

export default TextfieldMini;