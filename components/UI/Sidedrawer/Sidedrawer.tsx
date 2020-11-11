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
    Book
} from 'react-bootstrap-icons'
import axios from 'axios'
import stateInterface from '../../../interfaces/stateInterface'
import UserDisplay from './UserDisplay/UserDisplay'

interface Props {
    open: Boolean;
    toggle: () => void;
}

const Sidedrawer: React.FC<Props> = ({ open, toggle }) => {
    let sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);
    const [userId, setUserId] = useState('');
    const [setIdOnce, setSetIdOnce] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!sessionUser) {
            async function fetchSessionUser () {
                const sessionUserAPI = await axios.get('/c-api/verified');
                console.log('Executed API call')
                dispatch(setSessionUser(sessionUserAPI.data.sessionUser));
            }
            fetchSessionUser()
        }

        if (!setIdOnce && sessionUser) {
            setUserId(sessionUser._id);
            setSetIdOnce(true);
        }
    })

    const menuItemsUnAuth = [
        {
            component: <HouseDoorFill />,
            text: 'Home',
            route: '/'
        },
        {
            component: <BoxArrowInRight />,
            text: 'Sign in',
            route: '/login'
        },
        {
            component: <PersonPlus />,
            text: 'Register',
            route: '/register'
        }
    ]

    const menuItemsAuth = [
        {
            component: <HouseDoorFill />,
            text: 'Home',
            route: '/'
        },
        {
            component: <PlusSquare />,
            text: 'Create content',
            route: '/course/create-new'
        },
        {
            component: <Book />,
            text: 'My content',
            route: `/my-courses/${userId}`
        }
    ]

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