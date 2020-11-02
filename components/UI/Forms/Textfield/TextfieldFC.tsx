import React, { SyntheticEvent } from 'react'
import styles from './Textfield.module.css'

interface Props {
    placeholder: string;
    label?: string;
    inputValue: string;
    inputType: string;
    updateState: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

const Textfield: React.FC<Props> = ({ placeholder, label, inputValue, inputType, updateState }) => {
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
            />
        </div>
    </>
}

export default Textfield;