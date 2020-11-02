import React, { SyntheticEvent } from 'react'
import styles from './Textfield.module.css'

interface Props {
    placeholder: string;
    label: string;
    inputValue: string;
    inputType: string;
    fieldName: string;
    changeHandler: (event: SyntheticEvent, inputField: string) => void;
}

const Textfield: React.FC<Props> = ({ placeholder, label, inputValue, inputType, changeHandler, fieldName }) => {
    return<>
        <div className={styles.TextfieldContainer}>
            <label>{label}</label>
            <input
            value={inputValue}
            placeholder={placeholder}
            type={inputType}
            onChange={(event) => changeHandler(event, fieldName)}
            />
        </div>
    </>
}

export default Textfield;