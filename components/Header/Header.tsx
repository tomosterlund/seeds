import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'
import { Menu, Public } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import stateInterface from '../../interfaces/stateInterface'
import langAbbreviation from './langAbbreviation'
import ModalMini from '../UI/Modals/ModalMini/ModalMini'
import Axios from 'axios'
import { setLanguage } from '../../store/actions/setLanguage'
import Cookies from 'js-cookie'

interface Props {
    activeNavItem?: String;
    toggleSidedrawer: () => void;
}

const Header: React.FC<Props> = ({ activeNavItem, toggleSidedrawer }) => {

    const [ranUseEffect, setRanUseEffect] = useState(false);
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: stateInterface) => state.sessionReducer);
    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [showLanguageList, setShowLanguageList] = useState(false);

    useEffect(() => {
        if (!sessionUser && !ranUseEffect) {
            const languageCookie = Cookies.get('seedsLanguage');
            if (languageCookie) {
                setNewLanguage(languageCookie);
            }
            setRanUseEffect(true);
        }
    })

    const toggleLanguageList = () => {
        setShowLanguageList(!showLanguageList);
    }

    const languages = ['deutsch', 'english'];

    const setNewLanguage = async (lang: string) => {
        try {
            if (sessionUser) {
                await Axios.post('/c-api/set-language', { language: lang });
            }
            
            Cookies.set('seedsLanguage', lang, { expires: 365 });
            dispatch(setLanguage(lang));
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <header className={styles.Header}>
            <div className={styles.LogoContainer}>
                <img alt="Seeds logo" src="/assets/images/seeds1.svg" />
                <h1>Seeds</h1>
            </div>

            <Menu
                onClick={toggleSidedrawer}
                className={styles.MenuIcon}
            />

            <div
                className={styles.LanguageOption}
                onClick={toggleLanguageList}
            >
                <Public className={styles.GlobeIcon} fontSize="small" style={{ margin: '0 6px 0 0' }} />
                {langAbbreviation(userLang)}
            </div>

            <div onMouseLeave={toggleLanguageList} className={styles.LanguageList}>
                <ModalMini position="right" show={showLanguageList}>
                    {languages.map((l, i) => (
                        <div
                            className={styles.ListItem}
                            key={i}
                            onClick={() => setNewLanguage(l)}
                        >
                            {l}
                        </div>
                    ))}
                </ModalMini>
            </div>
        </header>
    </>
}



export default Header;