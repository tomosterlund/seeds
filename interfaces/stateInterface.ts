interface stateInterface {
    sessionReducer: {
        sessionUser: {
            _id: string,
            courses: [],
            joinDate: string,
            imageUrl: string,
            userType: string,
            premiumUser: boolean,
            name: string,
            email: string,
            password: string,
            __v: number
        }
    },
    showQuizEditor: {
        showQuizEditor: boolean,
        lessonId: string
    }
}

export default stateInterface;