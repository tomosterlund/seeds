import React, { ReactNode } from 'react'
import styles from './Layout.module.css'
import Head from 'next/head'
import Header from './../Header/Header'

interface Props {
    children: ReactNode;
    title: String; 
}

const Layout: React.FC<Props> = ({ children, title }) => {
    return <>
        <div>
            <Head>
                <title>{ title }</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
            </Head>

            <Header />

            <main>
                { children }
            </main>
        </div>
    </>
}

export default Layout;