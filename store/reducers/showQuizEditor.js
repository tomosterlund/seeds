import * as types from '../types'

const initialState = {
    showQuizEditor: false,
    lessonId: ''
}

export const showQuizEditor = (state = initialState, action) => {
    switch(action.type) {
        case types.SHOW_QUIZ_EDITOR:
            return {
                ...state,
                showQuizEditor: true,
                lessonId: action.payload
            };
        case types.HIDE_QUIZ_EDITOR:
            return {
                ...state,
                showQuizEditor: false,
                lessonId: ''
            }
        default:
            return state;
    }
}