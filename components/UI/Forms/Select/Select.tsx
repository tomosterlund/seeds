import React from 'react'
import { useSelector } from 'react-redux';
import stateInterface from '../../../../interfaces/stateInterface';
import { capitalizeStr } from '../../../../util/stringTransformation/commonStringOps';
import styles from './../Textfield/Textfield.module.css'

interface Props {
    inputValue: string;
    label: string;
    changeHandler: (event: any, fieldName: string) => void;
    fieldName: string;
    optionsArr: string[];
}

const Select: React.FC<Props> = ({ inputValue, label, changeHandler, fieldName, optionsArr }) => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    const options = (optionsArr.map((o, i) => (
        <option key={i} className={styles.Option} value={o}>
            {capitalizeStr(o)}
        </option>
    )))

    return<>
        <div className={styles.TextfieldContainer}>
            <label>{label}</label>
            <select
            className={styles.Select}
            onChange={(event) => changeHandler(event, fieldName)}
            value={inputValue} 
            name="cars"
            >
                {options}
            </select>
        </div>
    </>
}

export default Select;