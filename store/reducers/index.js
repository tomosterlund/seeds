import { combineReducers } from 'redux'
import { sessionReducer } from './sessionReducer'
import { showQuizEditor } from './showQuizEditor'
import { languageReducer } from './languageReducer'

export default combineReducers({
    sessionReducer,
    showQuizEditor,
    languageReducer
})