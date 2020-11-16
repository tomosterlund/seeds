import React from 'react'
import styles from './QuestionOverview.module.css'

interface overviewObj {
    qNum: number;
    state: string;
}

interface Props {
    qOverview: overviewObj[];
}

const qNumberStyles = (state: string) => {
    if (state === 'waiting') {
        return {backgroundColor: 'transparent'}
    }

    if (state === 'true') {
        return {backgroundColor: 'rgba(19, 170, 82, 0.747)'}
    }

    if (state === 'false') {
        return {backgroundColor: 'rgba(202, 58, 58, 0.555)'}
    }
}

const QuestionOverview: React.FC<Props> = ({ qOverview }) => {
    return<>
        <div className={styles.QuestionOverview}>
            {qOverview.map((q, i) => (
                <div
                    key={i}
                    className={styles.QNumber}
                    style={qNumberStyles(q.state)}
                >
                    {q.qNum + 1}
                </div>
            ))}
        </div>
    </>
}

export default QuestionOverview;