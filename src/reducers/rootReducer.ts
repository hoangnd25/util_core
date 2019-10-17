import { combineReducers } from 'redux';
import { sessionReducer } from './session';
import { runtimeReducer } from './runtime';

const rootReducer = combineReducers({
  runtime: runtimeReducer,
  currentSession: sessionReducer,
});

export default rootReducer;
