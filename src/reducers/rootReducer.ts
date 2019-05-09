import { combineReducers } from 'redux';
import { runtimeDefaultState, runtimeReducer } from './runtime';

export const initialState = {
  runtime: runtimeDefaultState,
};

const rootReducer = combineReducers({
  runtime: runtimeReducer,
});

export default rootReducer;
