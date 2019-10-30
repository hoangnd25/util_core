import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { ReduxState } from '@src/types/reducers';
import rootReducer from '@src/reducers/rootReducer';
import createHelpers from './createHelpers';

export default function initializeStore(initialState: ReduxState, helpersConfig: any) {
  const helpers = createHelpers(helpersConfig);

  let composeEnhancers = compose;

  if (
    process.env.ENV !== 'production' &&
        !(typeof window === 'undefined') &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  const enhancer = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(helpers) as ThunkMiddleware<ReduxState, AnyAction, typeof helpers>)
  );

  return createStore(rootReducer, initialState, enhancer);
}
