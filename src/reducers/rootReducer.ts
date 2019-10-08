import { combineReducers } from 'redux';
import { accountReducer } from './account';
import { runtimeDefaultState, runtimeReducer } from './runtime';

export const initialState = {
  runtime: runtimeDefaultState,
};

const rootReducer = combineReducers({
  runtime: runtimeReducer,
  currentSession: accountReducer,
});

export default rootReducer;
