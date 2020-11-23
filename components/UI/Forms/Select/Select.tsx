import React from 'react'
import { useSelector } from 'react-redux';
import stateInterface from '../../../../interfaces/stateInterface';
import selectLang from '../../../../util/language/components/forms/select';
import styles from './../Textfield/Textfield.module.css'

interface Props {
    inputValue: string;
    label: string;
    changeHandler: (event, fieldName) => void;
    fieldName: string;
}

const Select: React.FC<Props> = ({ inputValue, label, changeHandler, fieldName }) => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    return<>
        <div className={styles.TextfieldContainer}>
            <label>{label}</label>
            <select
            className={styles.Select}
            onChange={(event) => changeHandler(event, fieldName)}
            value={inputValue} 
            name="cars"
            >
                <option value="languages">{selectLang[userLang].languages}</option>
                <option value="maths">{selectLang[userLang].maths}</option>
                <option value="science">{selectLang[userLang].science}</option>
                <option value="geography">{selectLang[userLang].geography}</option>
                <option value="music">{selectLang[userLang].music}</option>
                <option value="sports">{selectLang[userLang].sports}</option>
                <option value="other">{selectLang[userLang].other}</option>
            </select>
        </div>
    </>
}

export default Select;