import React, { ReactNode, useState, useEffect } from 'react'
import styles from './Layout.module.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from './../Header/Header'
import Sidedrawer from './../UI/Sidedrawer/Sidedrawer'
import Backdrop from './../UI/Backdrop/Backdrop'
import PageLoader from './../UI/PageLoader/PageLoader'

interface Props {
    children: ReactNode;
    title: String; 
}

const Layout: React.FC<Props> = ({ children, title }) => {
    const [showSidedrawer, setShowSidedrawer] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const toggleDrawer = () => {
        setShowSidedrawer(!showSidedrawer);
    }

    const router = useRouter()

    useEffect(() => {
        const handleRouteChange = (url) => {
          console.log('App is changing to: ', url)
          setShowLoader(true);
        }
    
        router.events.on('routeChangeStart', handleRouteChange);
        router.events.on('routeChangeComplete', () => setShowLoader(false))
    
        return () => {
          router.events.off('routeChangeStart', handleRouteChange);
        }
    }, [])

    return <>
        <div className={styles.FullScreen}>
            <div className={styles.Layout}>
                <Head>
                    <title>{ title }</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
                </Head>
                {
                    showLoader ? <PageLoader /> : null 
                }

                <Header toggleSidedrawer={toggleDrawer} />
                <Sidedrawer open={showSidedrawer} toggle={toggleDrawer} />
                <Backdrop toggle={toggleDrawer} show={showSidedrawer} />

                <main>
                    { children }
                </main>
            </div>
        </div>
    </>
}

export default Layout;