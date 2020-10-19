import React from 'react'
import styles from './Header.module.css'

interface Props {
    activeNavItem?: String;
}

const Header: React.FC<Props> = ({ activeNavItem }) => {
    return<>
        <header className={styles.Header}>
            Header
        </header>
    </>
}

export default Header;