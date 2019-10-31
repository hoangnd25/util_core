import React from 'react';
import { USER_UPDATE as USER_UPDATE_ACTION } from '@src/reducers/session';
import { CurrentSessionType } from "@src/types/user";
import initializeStore from './configureStore';

/**
 * Based of the example on https://github.com/zeit/next.js/tree/canary/examples/with-redux
 */

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';
/* istanbul ignore file */
function getOrCreateStore(initialState, helpers) {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === 'undefined') {
    return initializeStore(initialState, helpers);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState, helpers);
  }
  return window[__NEXT_REDUX_STORE__];
}

export default (App, helpers) =>
  class AppWithRedux extends React.Component<{ currentSession: CurrentSessionType, initialReduxState: {}}> {
    static async getInitialProps(appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore({}, helpers);

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      };
    }

    reduxStore = null;

    constructor(props) {
      super(props);
      const { initialReduxState = {}, currentSession = null } = props;
      this.reduxStore = getOrCreateStore({ ...initialReduxState, currentSession }, helpers);
    }

    render() {
      const { currentSession } = this.props;
      // currentSession has been initialized during run time, e.g. client side login with local Storage data
      const reduxCurrentSession = this.reduxStore.getState().currentSession;
      if (currentSession && currentSession.authenticated === true && (reduxCurrentSession === null || reduxCurrentSession.authenticated === false)) {
        this.reduxStore.dispatch({
          type: USER_UPDATE_ACTION,
          payload: { ...currentSession },
        });
      }
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
