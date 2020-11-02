import React from 'react'
import styles from './../Textfield/Textfield.module.css'

interface Props {
    inputValue: string;
    label: string;
    changeHandler: (event, fieldName) => void;
    fieldName: string;
}

const Select: React.FC<Props> = ({ inputValue, label, changeHandler, fieldName }) => {
    return<>
        <div className={styles.TextfieldContainer}>
            <label>{label}</label>
            <select
            className={styles.Select}
            onChange={(event) => changeHandler(event, fieldName)}
            value={inputValue} 
            name="cars"
            >
                <option value="languages">Languages</option>
                <option value="maths">Maths</option>
                <option value="science">Science</option>
                <option value="geography">Geography</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
            </select>
        </div>
    </>
}

export default Select;