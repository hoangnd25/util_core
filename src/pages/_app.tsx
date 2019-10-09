import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { NotificationContainer, Provider as Go1dProvider, globalCSS, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import App from 'next/app';
import Cookies from 'universal-cookie';
import Suspense, { LoadingSpinner } from '../components/Suspense';
import LinkComponent from '../components/Link';
import withReduxStore from '../store/withReduxStore';
import AppContext from '../utils/appContext';
import createHttp from '../utils/http';
import { USER_UPDATE as USER_UPDATE_ACTION } from '../reducers/session';
import { withCurrentSession } from '../components/WithAuth';
import { CurrentSessionType } from '../types/user';

const cookies = new Cookies();
const http = createHttp();

interface AppProps {
    reduxStore: any;
    currentSession: CurrentSessionType;
}

export class GO1App extends App<AppProps, any> {

  public static async getInitialProps(ctx) {
    const { currentSession, reduxStore, Component } = ctx;
    // deactive caching for HTML due to CDN
    if (ctx && ctx.ctx && ctx.ctx.res) {
      ctx.ctx.res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      ctx.ctx.res.setHeader("Pragma", "no-cache");
      ctx.ctx.res.setHeader("Expires", "no-cache");
    }

    // Add health check
    if (ctx && ctx.router && ctx.router.asPath === "/healthz") {
      ctx.ctx.res.statusCode = 200;
      ctx.ctx.res.end("Ok");
    }

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {currentSession, reduxStore, pageProps} as any;
  }

  public render() {
    const { Component, pageProps, reduxStore, currentSession } = this.props;
    // Show loading if current Session has not been loaded
    if (currentSession && reduxStore && reduxStore.getState().currentSession === null) {
      reduxStore.dispatch({
        type: USER_UPDATE_ACTION,
        payload: { ...currentSession },
      });
    } else if (currentSession === null) {
      // can be replaced with a skeleton
      return <LoadingSpinner />;
    }

    const context = {
      cookies,
      http,
    };

    return (
      <AppContext.Provider value={context}>
        <ReduxProvider store={reduxStore}>
          <Go1dProvider
            linkComponent={LinkComponent}
            accent={getNested(currentSession, 'portal.data.theme.primary', foundations.colors.accent)}
            logo={getNested(currentSession, 'portal.files.logo', null)}
          >
          <Suspense>
            <IntlProvider locale="en">
              <Component {...pageProps} />
              <NotificationContainer />
            </IntlProvider>
          </Suspense>
          </Go1dProvider>
        </ReduxProvider>
      </AppContext.Provider>
    );
  }
}

export default withCurrentSession(withReduxStore(GO1App, { cookies, http }), {
  http,
});
