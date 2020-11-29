import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import stateInterface from '../../../interfaces/stateInterface'
import styles from './HomePageSlogan.module.css'

const HomePageSlogan: React.FC = () => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    let slogan: any;

    if (userLang === 'english') {
        slogan = (
            <Fragment>
                <h4 style={{ margin: '24px 0 4px 0px' }}>
                    Planting <span className={styles.Green}>seeds</span> for the future
                </h4>
                <h4 style={{ margin: '4px 0 4px 120px' }}>through <span className={styles.Green}>education</span></h4>
            </Fragment>
        )
    }

    if (userLang === 'deutsch') {
        slogan = (
            <Fragment>
                <h4 style={{ margin: '24px 0 4px 0px' }}>
                    <span className={styles.Green}>Samen</span> für die Zukunft
                </h4>
                <h4 style={{ margin: '4px 0 4px 120px' }}>durch <span className={styles.Green}>Bildung</span> pflanzen</h4>
            </Fragment>
        )
    }

    return<>
        <div className={styles.SloganContainer}>
            <img
                src="assets/images/tutorial.svg"
                className={styles.RoadToKnowledge}
            />
            {slogan}
        </div>
    </>
}

export default HomePageSlogan;