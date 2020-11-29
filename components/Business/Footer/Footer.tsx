import React from 'react'
import { useSelector } from 'react-redux';
import stateInterface from '../../../interfaces/stateInterface';
import footerLang from '../../../util/language/components/business/footer';
import styles from './Footer.module.css'
import Router from 'next/router'

const Footer: React.FC = () => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    const d = new Date();
    const year = d.getFullYear();

    return<>
        <div className={styles.Footer}>

            <div className={styles.AltsColumn}>
                <h5>
                    {footerLang[userLang].teachers}
                </h5>
                <ul>
                    <li>
                        {footerLang[userLang].howToUse}
                    </li>
                    <li>
                        {footerLang[userLang].joinTeam}
                    </li>
                </ul>
            </div>

            <div className={styles.AltsColumn}>
                <h5>
                    {footerLang[userLang].contact}
                </h5>
                <ul>
                    <li onClick={() => Router.push('/contact/report-issue')}>
                        {footerLang[userLang].reportIssues}
                    </li>
                    <li>
                        {footerLang[userLang].contactUs}
                    </li>
                </ul>
            </div>

            <div className={styles.CopyrightStamp}>
                &#169; {year} Seeds GbR
            </div>

        </div>
    </>
}

export default Footer;