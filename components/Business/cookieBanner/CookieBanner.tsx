import React from 'react'
import styles from './CookieBanner.module.css'
import Backdrop from './../../UI/Backdrop/Backdrop'
import SeedButton from '../../UI/SeedsButton/SeedButton';
import ModalLarge from '../../UI/Modals/LargeModal/LargeModal';
import SeedsHeader from '../../Presentational/SeedsHeader/SeedsHeader';
import { useSelector } from 'react-redux';
import stateInterface from '../../../interfaces/stateInterface';
import legalDiscLang from '../../../util/language/user/legal-disclaimer';
import Link from 'next/link';

interface Props {
    show: boolean;
    accept: () => void;
}

const CookieBanner: React.FC<Props> = ({ show, accept }) => {

    const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

    return<>
        <div className={styles.CookieBanner}>
            <ModalLarge show={show}>
                <SeedsHeader text={legalDiscLang[userLang].hdr} />
                <p>
                    {legalDiscLang[userLang].txt1}
                </p>

                <p>
                    {userLang === 'deutsch' ? (
                        <span>
                            Um unsere Webpage weiter zu benutzen, müssen Sie zuerst <Link href="/documents/de/datenschutz"><a target="_blank">diese Bedingungen</a></Link> zustimmen.
                        </span>
                    ) : null}

                    {userLang === 'english' ? (
                        <span>
                            If you want to use our service, you need to accept the terms stated in our data policy, which can be found&nbsp;<Link href="/documents/en/data-policy"><a target="_blank">here.</a></Link>
                        </span>
                    ) : null}
                </p>
                <SeedButton
                    text={legalDiscLang[userLang].btn}
                    image={false}
                    click={accept}
                />
            </ModalLarge>
            <Backdrop show={show} />
        </div>
    </>
}

export default CookieBanner;