import React from 'react';
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
  class AppWithRedux extends React.Component {
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
          this.reduxStore = getOrCreateStore(props.initialReduxState, helpers);
        }

        render() {
          /* tslint:disable */
          return <App {...this.props} reduxStore={this.reduxStore} />;
        }
  };
