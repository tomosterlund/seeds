import { combineReducers } from 'redux'
import { sessionReducer } from './sessionReducer'
import { showQuizEditor } from './showQuizEditor'

export default combineReducers({
    sessionReducer,
    showQuizEditor
})