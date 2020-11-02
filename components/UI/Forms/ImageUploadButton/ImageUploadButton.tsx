import React from 'react'
import styles from './ImageUploadButton.module.css'
import { PhotoCamera } from '@material-ui/icons'

interface Props {
    chosenImage?: string;
    openFileHandler: () => void;
    text: string;
    camera: boolean;
}

const ImageUploadButton: React.FC<Props> = ({ chosenImage, openFileHandler, text, camera, children }) => {
    return<>
        <div onClick={openFileHandler} className={styles.ImageUploadButton}>
            {camera ? <PhotoCamera /> : null}
            {children}
            {
                chosenImage ? <p>{chosenImage}</p> : <p>{text}</p>
            }
        </div>
    </>
}

export default ImageUploadButton;