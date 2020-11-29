import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSessionUser } from './../../../store/actions/sessionAction'
import styles from './Sidedrawer.module.css'
import Link from 'next/link'
import { 
    BoxArrowInRight,
    HouseDoorFill,
    PersonPlus,
    PlusSquare,
    Book,
    Sliders
} from 'react-bootstrap-icons'
import axios from 'axios'
import stateInterface from '../../../interfaces/stateInterface'
import UserDisplay from './UserDisplay/UserDisplay'
import sidebarLang from './../../../util/language/sidebar'
import { setLanguage } from '../../../store/actions/setLanguage'

interface Props {
    open: Boolean;
    toggle: () => void;
}

const Sidedrawer: React.FC<Props> = ({ open, toggle }) => {
    let sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);
    let userLang = useSelector((state: stateInterface) => state.languageReducer.language);
    const [userId, setUserId] = useState('');
    const [setIdOnce, setSetIdOnce] = useState(false);
    const [ranFetchSession, setRanFetchSession] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!sessionUser && !ranFetchSession) {
            async function fetchSessionUser () {
                const sessionUserAPI = await axios.get('/c-api/verified');
                console.log('Executed API call')
                dispatch(setSessionUser(sessionUserAPI.data.sessionUser));
                if (sessionUserAPI.data.sessionUser) {
                    dispatch(setLanguage(sessionUserAPI.data.sessionUser.language))
                }
            }
            fetchSessionUser();
            setRanFetchSession(true);
        }

        if (!setIdOnce && sessionUser) {
            setUserId(sessionUser._id);
            setSetIdOnce(true);
        }
    })

    const menuItemsUnAuth = [
        {
            component: <HouseDoorFill />,
            text: sidebarLang[userLang].home,
            route: '/'
        },
        {
            component: <BoxArrowInRight />,
            text: sidebarLang[userLang].login,
            route: '/login'
        },
        {
            component: <PersonPlus />,
            text: sidebarLang[userLang].register,
            route: '/register'
        }
    ]

    let menuItemsAuth = [];

    if (sessionUser) {
        menuItemsAuth = [
            {
                component: <HouseDoorFill />,
                text: sidebarLang[userLang].home,
                route: '/'
            },
            {
                component: <PlusSquare />,
                text: sidebarLang[userLang].createContent,
                route: '/course/create-new'
            },
            {
                component: <Book />,
                text: sidebarLang[userLang].myContent,
                route: `/my-courses/${userId}`
            },
            {
                component: <Sliders />,
                text: sidebarLang[userLang].accountSettings,
                route: `/settings/${userId}`
            },
        ]
    }

    return<>
        <div className={open ? [styles.Sidedrawer, styles.Show].join(' ') : [styles.Sidedrawer, styles.Hide].join(' ')}>
            <UserDisplay close={toggle} />
            <ul className={styles.NavList}>
                {
                    sessionUser ? (
                        menuItemsAuth.map((menuItem, index) => (
                            <li onClick={toggle} key={index}>
                                <Link href={menuItem.route}>
                                    <a>
                                        {menuItem.component}
                                        <p>{menuItem.text}</p>
                                    </a>
                                </Link>
                            </li>
                        ))
                    ) : (
                        menuItemsUnAuth.map((menuItem, index) => (
                            <li onClick={toggle} key={index}>
                                <Link href={menuItem.route}>
                                    <a>
                                        {menuItem.component}
                                        <p>{menuItem.text}</p>
                                    </a>
                                </Link>
                            </li>
                        ))
                    )
                }
                
            </ul>
        </div>
    </>
}   

export default React.memo(Sidedrawer);