import * as types from '../types'

export const showQuizEditor = (payload) => async dispatch => {
    dispatch({ type: types.SHOW_QUIZ_EDITOR, payload: payload });
}

export const hideQuizEditor = (payload) => async dispatch => {
    dispatch({ type: types.HIDE_QUIZ_EDITOR, payload: payload });
}