import React from 'react'
import styles from './RegistrationGreeting.module.css'

const RegistrationGreeting: React.FC = () => {
    return<>
        <div className={styles.GreetingContainer}>
            <img className={styles.TutorialIMG} src="/assets/images/tutorial.svg" />
            <div>
                <p>
                    <span style={{ fontSize: '22px' }}>Welcome</span> to
                </p>
                <p>
                    <span style={{ fontSize: '11px' }}>the new</span> learning
                </p>
                <p>
                    <span style={{ fontSize: '20px' }}> movement!</span>
                </p>
            </div>
        </div>
    </>
}

export default RegistrationGreeting;