import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { NotificationContainer, globalCSS, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import CommonProvider from '@go1d/mine/common/Provider';

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
import config from '../config';

const cookies = new Cookies();
const http = createHttp();
const noOP = () => null;

const context = {
  cookies,
  http,
};

interface AppProps {
    reduxStore: any;
    currentSession: CurrentSessionType;
}

export class GO1App extends App<AppProps, any> {

  public static async getInitialProps(ctx) {
    const { Component } = ctx;
    // deactive caching for HTML due to CDN
    if (ctx && ctx.ctx && ctx.ctx.res) {
      ctx.ctx.res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      ctx.ctx.res.setHeader("Pragma", "no-cache");
      ctx.ctx.res.setHeader("Expires", "no-cache");
    }

    // Add health check
    if (ctx && ctx.router && (ctx.router.asPath === "/healthz" || ctx.router.asPath === "/container_status")) {
      ctx.ctx.res.statusCode = 200;
      ctx.ctx.res.end("Ok");
    }

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps } as any;
  }

  public render() {
    const { Component, pageProps, reduxStore, currentSession, router } = this.props;
    // Show loading if current Session has not been loaded
    if (currentSession === null) {
      // can be replaced with a skeleton
      return <LoadingSpinner />;
    }

    return (
      <AppContext.Provider value={context}>
        <ReduxProvider store={reduxStore}>
          <IntlProvider locale="en"  defaultLocale="en" onError={noOP}>
            <CommonProvider
              linkComponent={LinkComponent}
              accent={getNested(currentSession, 'portal.data.theme.primary', foundations.colors.accent)}
              // logo={getNested(currentSession, 'portal.files.logo', null)}
              pushNavigationState={router.push}
              apiUrl={config.apiEndpoint}
              jwt={currentSession.jwt}
              accountId={getNested(currentSession, "account.id", undefined)}
              portalId={parseInt(getNested(currentSession,"portal.id", undefined), 10) }
            >
              <Suspense>
                <Component router={router} {...pageProps} />
                <NotificationContainer />
              </Suspense>
            </CommonProvider>
          </IntlProvider>
        </ReduxProvider>
      </AppContext.Provider>
    );
  }
}

export default withCurrentSession(withReduxStore(GO1App, { cookies, http }), {
  http,
});
