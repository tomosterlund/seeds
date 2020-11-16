import React from 'react'
import styles from './Header.module.css'
import { Menu } from '@material-ui/icons'

interface Props {
    activeNavItem?: String;
    toggleSidedrawer: () => void;
}

const Header: React.FC<Props> = ({ activeNavItem, toggleSidedrawer }) => {
    return<>
        <header className={styles.Header}>
            <div className={styles.LogoContainer}>
                <img alt="Seeds logo" src="/assets/images/seeding.svg" />
                <h1>Seeds</h1>
            </div>
            <Menu
            onClick={toggleSidedrawer}
            className={styles.MenuIcon}
            />
        </header>
    </>
}



export default Header;