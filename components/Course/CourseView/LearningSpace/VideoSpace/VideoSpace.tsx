import React, { useState, useRef, useEffect } from 'react'
import VideoLesson from '../../../../../interfaces/LessonInterfaces/VideoInterface';
import styles from './VideoSpace.module.css'

interface Props {
    videoData: VideoLesson;
}

const VideoSpace: React.FC<Props> = ({ videoData }) => {

    return <>
        <div key={videoData._id} className={styles.VideoSpace}>
            <div className={styles.VideoContainer}>
                <video controls >
                    <source src={`https://seeds-platform.s3.eu-central-1.amazonaws.com/${videoData.videoUrl}`} type="video/mp4" />
                </video>
            </div>
        </div>
    </>
}

export default VideoSpace;