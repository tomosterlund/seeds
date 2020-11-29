import Head from 'next/head'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import Footer from '../components/Business/Footer/Footer'
import HomePageSlogan from '../components/Presentational/HomePageSlogan/HomePageSlogan'
import stateInterface from '../interfaces/stateInterface'
import styles from '../styles/Home.module.css'
import homePageLang from '../util/language/pages/home'
import Layout from './../components/Layout/Layout'

export default function Home() {

  const userLang = useSelector((state: stateInterface) => state.languageReducer.language);

  const goToInstructions = () => {
    Router.push('/lesson/5fbf3fec0973eb72584904a4');
  }

  return <>
    <Layout title="Home | Seeds">
      <div className={styles.HomePage}>
        <div className={styles.PresentationBox}>

          <HomePageSlogan />
          <button onClick={goToInstructions}>
            {homePageLang[userLang].instructions}
          </button>

        </div>
        <div className={styles.BigGreenBox}>
          <h2>
            {homePageLang[userLang].subjects}:
          </h2>
          <div className={styles.buttonContainer}>
            <button>
              {homePageLang[userLang].maths}
            </button>
            <button>
              {homePageLang[userLang].english}
            </button>
            <button>
              {homePageLang[userLang].music}
            </button>
            <button>
              {homePageLang[userLang].latin}
            </button>
          </div>
        </div>
      </div>
    </Layout>
    <Footer />
  </>
}
