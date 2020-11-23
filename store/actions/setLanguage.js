import * as types from '../types'

export const setLanguage = (payload) => async dispatch => {
    dispatch({ type: types.SET_LANGUAGE, payload: payload });
}