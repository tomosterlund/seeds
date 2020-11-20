import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import Router from 'next/router'
import styles from './UserDisplay.module.css'
import stateInterface from '../../../../interfaces/stateInterface'
import { Clear } from '@material-ui/icons';
import axios from 'axios'

interface Props {
    close: () => void;
}

const UserDisplay: React.FC<Props> = ({ close }) => {
    let sessionUser = useSelector((state: stateInterface) => state.sessionReducer.sessionUser);

    const signOutHandler = async () => {
        try {
            await axios.get('/c-api/signout');
            Router.push('/login');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return<>
            {
                sessionUser ? (
                    <Fragment>
                        <div className={styles.UserDisplay}>
                            <div onClick={close} className={styles.CloseIcon}>
                                <Clear />
                            </div>
                            <div className={styles.ImageContainer} style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${sessionUser.imageUrl}')` }} />
                            <div className={styles.TextContainer}>
                                <p>{sessionUser.name}</p>
                                <div className={styles.UserOptions}>
                                    <p onClick={signOutHandler} style={{ margin: '0 8px 0 0' }}>Sign out</p>
                                    |
                                    <p onClick={() => Router.push(`/settings/${sessionUser._id}`)} style={{ margin: '0 0 0 8px' }}>Settings</p>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ) : null
            }
    </>
}

export default UserDisplay;