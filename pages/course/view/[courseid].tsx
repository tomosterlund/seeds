import React from 'react'
import { useRouter } from 'next/router'
import styles from './CourseView.module.css'
import Layout from '../../../components/Layout/Layout'
import CourseNav from '../../../components/Course/CourseNav/CourseNav'

export default function CourseView() {
    const router = useRouter()
    const { courseid } = router.query

    return<>
        <Layout title={`${courseid} | Seeds`}>
            <div>
                <CourseNav courseTitle={String(courseid)} />
            </div>
        </Layout>
    </>
}