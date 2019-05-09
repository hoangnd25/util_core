import * as LibHistory from 'history';
import queryString from 'query-string';
import * as React from 'react';
import { CookiesProvider } from 'react-cookie';
import deepForceUpdate from 'react-deep-force-update';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ErrorReporter from 'redbox-react';
import App from './components/App';
import history from './core/history';
import router from './router';
import configureStore from './store/configureStore';

const store = configureStore(window.APP_STATE, { history });

const context = {
  // Enables critical path CSS rendering: https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles: Array<{ _insertCss: () => () => void }>) => {
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  },
  store,
};

// Switch off the native scroll restoration behavior and handle it manually
const scrollPositionsHistory: { [key: string]: { scrollX: number; scrollY: number } } = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const container = document.getElementById('app');
let appInstance: null | void | Element | React.Component<any, any, any>;
let currentLocation = history ? history.location : ({ key: '' } as LibHistory.Location);

// Re-render the app when window.location changes
async function onLocationChange(location: LibHistory.Location, action?: {}) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key || ''] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key || ''];
  }

  currentLocation = location;
  const isInitialRender = !action;

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await router.resolve({
      ...context,
      host: window.location.host,
      pathname: location.pathname,
      query: queryString.parse(location.search),
      protocol: window.location.protocol,
    });

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      if (history) {
        history.replace(route.redirect);
      }
      return;
    }

    appInstance = ReactDOM.hydrate(
      <CookiesProvider>
        <Provider store={context.store}>
          <App context={context}>{route.component}</App>
        </Provider>
      </CookiesProvider>,
      container,
      () => {
        if (isInitialRender) {
          // Switch off the native scroll restoration behavior and handle it manually
          // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
          if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
          }

          const elem = document.getElementById('css');

          if (elem && elem.parentNode) {
            elem.parentNode.removeChild(elem);
          }

          return;
        }

        document.title = route.title;

        // Restore the scroll position if it was saved into the state
        let scrollX = 0;
        let scrollY = 0;
        const pos = scrollPositionsHistory[location.key || ''];
        if (pos) {
          scrollX = pos.scrollX;
          scrollY = pos.scrollY;
        } else {
          const targetHash = location.hash.substr(1);
          if (targetHash) {
            const target = document.getElementById(targetHash);
            if (target) {
              scrollY = window.pageYOffset + target.getBoundingClientRect().top;
            }
          }
        }

        window.scrollTo(scrollX, scrollY);

        // Google Analytics tracking. Don't send 'pageview' event after the initial rendering, as it was already sent
        if (window.ga) {
          window.ga('send', 'pageview', LibHistory.createPath(location));
        }
      }
    );
  } catch (error) {
    // Display the error in full-screen for development mode
    if (__DEV__) {
      appInstance = null;
      document.title = `Error: ${error.message}`;
      ReactDOM.hydrate(<ErrorReporter error={error} />, container);
      throw error;
    }

    // tslint:disable-next-line:no-console
    console.error(error);

    // Do a full page reload if error occurs during client-side navigation
    if (!isInitialRender && currentLocation.key === location.key) {
      window.location.reload();
    }
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
if (history) {
  history.listen(onLocationChange);
}
onLocationChange(currentLocation);

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
if (__DEV__) {
  window.addEventListener('error', event => {
    appInstance = null;
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.hydrate(<ErrorReporter error={event.error} />, container);
  });
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./router', () => {
    // @ts-ignore
    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      // Force-update the whole tree, including components that refuse to update
      deepForceUpdate(appInstance);
    }

    onLocationChange(currentLocation, '');
  });
}
