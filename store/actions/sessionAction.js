import * as types from '../types'

export const setSessionUser = (payload) => async dispatch => {
    dispatch({
        type: types.SET_USER,
        payload: payload
    })
}