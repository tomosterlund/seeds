import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from './../components/Layout/Layout'
import axios from 'axios'

export default function Home() {
  const getResponse = async () => {
    try {
      const postedVideo = await axios.post('/seedsapi/post-video');
      console.log(postedVideo);
    } catch (error) {
      console.log(error);
    }
  }

  return <>
    <Layout title="Home | Seeds">
      
    </Layout>
  </>
}
