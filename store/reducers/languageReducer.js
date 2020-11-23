import * as types from '../types'

const initialState = {
    language: 'english'
}

export const languageReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            };
        default:
            return state;
    }
}