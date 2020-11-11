import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import styles from './MyCourses.module.css'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import courseInterface from './../../interfaces/courseInterface'
import SeedsHeader from '../../components/Presentational/SeedsHeader/SeedsHeader'
import { Build } from '@material-ui/icons'
import Router from 'next/router'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const userId = ctx.params.userid;
    const myCoursesReq = await axios.get(`http://localhost:3000/c-api/my-courses/${String(userId)}`);
    const myCourses = myCoursesReq.data.myCourses;
    console.log(myCourses);
    return {
        props: {
            myCourses: myCourses
        }
    }
}

interface Props {
    myCourses: []
}

const MyCourses: React.FC<Props> = ({ myCourses }) => {
    const goToCourseEditor = (courseId: string) => {
        return Router.push(`/course/editor/${courseId}`);
    }

    return<>
    <Layout title="My courses | Seeds">
        <div className={styles.PageContainer}>
            <div className={styles.HeaderContainer}>
                <SeedsHeader text="My Courses" />
            </div>
            {myCourses.map((c: courseInterface) => (
                <div key={c._id} className={styles.CourseContainer}>
                    <div
                        style={{ backgroundImage: `url('https://seeds-platform.s3.eu-central-1.amazonaws.com/${c.imageUrl}')` }}
                        className={styles.CourseImage}
                    />
                    <p>
                        {c.title}
                    </p>
                    <div
                        className={styles.WrenchIconContainer}
                        onClick={() => goToCourseEditor(c._id)}
                    >
                        <Build />
                    </div>
                </div>
            ))}
        </div>
    </Layout>
    </>
}



export default MyCourses;