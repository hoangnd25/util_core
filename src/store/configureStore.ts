import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { ReduxState } from '../types/reducers';
import rootReducer from '../reducers/rootReducer';
import createHelpers from './createHelpers';

export default function initializeStore(initialState: ReduxState, helpersConfig: any) {
  const helpers = createHelpers(helpersConfig);

  let composeEnhancers = compose;

  if (
    process.env.APP_ENV !== 'production' &&
        !(typeof window === 'undefined') &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  const enhancer = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(helpers) as ThunkMiddleware<ReduxState, AnyAction, typeof helpers>)
  );

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('../reducers/rootReducer', () =>
      store.replaceReducer(require('../reducers/rootReducer').default)
    );
  }

  return store;
}
