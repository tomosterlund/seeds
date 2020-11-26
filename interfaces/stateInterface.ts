interface stateInterface {
    sessionReducer: {
        sessionUser: {
            _id: string,
            courses?: [],
            joinDate?: string,
            imageUrl: string,
            name: string,
            email: string,
            password?: string,
            __v: number,
            language: string;
        }
    },
    showQuizEditor: {
        showQuizEditor: boolean,
        lessonId: string
    },
    languageReducer: {
        language: string;
    }
}

export default stateInterface;