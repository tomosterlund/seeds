import sessionUser from './userInterface'

interface stateInterface {
    sessionReducer: sessionUser,
    showQuizEditor: {
        showQuizEditor: boolean,
        lessonId: string
    },
    languageReducer: {
        language: string;
    }
}

export default stateInterface;