import * as types from '../types'

const initialState = {
    sessionUser: null
}

export const sessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_USER:
            return {
                ...state,
                sessionUser: action.payload,
            }
        default:
            return state;
    }
}