import * as debug from 'debug';
import * as React from 'react';
import deepForceUpdate from 'react-deep-force-update';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorReporter from 'redbox-react';
import Cookies from 'universal-cookie';
import App from './app/App';
import config from './config';
import { create as createHttp } from './http';
import configureStore from './store/configureStore';

if (__DEV__) {
  debug.enable('go:*');
}

const cookies = new Cookies();
const http = createHttp();
const store = configureStore(window.APP_STATE, { http, cookies });

const context = {
  store,
  http,
};

const container = document.getElementById('app');
let appInstance = null;

try {
  appInstance = ReactDOM.hydrate(
    <Provider store={context.store}>
      <Router baseName={config.basePath}>
        <React.Suspense fallback="">
          <App context={context} />
        </React.Suspense>
      </Router>
    </Provider>,
    container,
    () => {
      const elem = document.getElementById('css');
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    }
  );
} catch (error) {
  // Display the error in full-screen for development mode
  if (__DEV__) {
    document.title = `Error: ${error.message}`;
    ReactDOM.hydrate(<ErrorReporter error={error} />, container);
    throw error;
  }

  // tslint:disable-next-line:no-console
  console.error(error);
}

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
if (__DEV__) {
  window.addEventListener('error', event => {
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.hydrate(<ErrorReporter error={event.error} />, container);
  });
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./client', () => {
    // @ts-ignore
    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      // Force-update the whole tree, including components that refuse to update
      deepForceUpdate(appInstance);
    }

    window.location.reload();
  });
}
