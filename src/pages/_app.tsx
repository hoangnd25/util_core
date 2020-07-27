import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { NotificationContainer, globalCSS, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import CommonProvider from '@go1d/mine/common/Provider';
import Router from "next/router";
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import Cookies from 'universal-cookie';
import Suspense, { LoadingSpinner } from '@src/components/common/Suspense';
import LinkComponent from '@src/components/common/Link';
import AppContext from '@src/utils/appContext';
import createHttp from '@src/utils/http';
import { withCurrentSession } from '@src/components/common/WithAuth';
import { CurrentSessionType } from '@src/types/user';
import config, { getBaseUrl } from '@src/config';
import initializeStore from '@src/store/configureStore';
import { getLocale, messages } from '@src/locales';

const cookies = new Cookies();
const http = createHttp();
const noOP = () => null;

const context = {
  cookies,
  http,
};

interface AppProps {
  store: any;
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
    if (ctx && ctx.router && ctx.router.asPath && (ctx.router.asPath.indexOf("/healthz") !== -1 || ctx.router.asPath.indexOf("/container_status") !== -1)) {
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
    const { Component, pageProps, store, currentSession } = this.props;
    // Show loading if current Session has not been loaded
    if (currentSession === null) {
      // can be replaced with a skeleton
      return <LoadingSpinner />;
    }

    const locale = getLocale(currentSession);
    return (
      <AppContext.Provider value={context}>
        <ReduxProvider store={store}>
          <IntlProvider locale={locale} messages={messages[locale]} onError={noOP}>
            <CommonProvider
              linkComponent={LinkComponent}
              accent={getNested(currentSession, 'portal.data.theme.primary', foundations.colors.accent)}
              // logo={getNested(currentSession, 'portal.files.logo', null)}
              pushNavigationState={Router.push}
              apiUrl={config.apiEndpoint}
              jwt={currentSession.jwt}
              accountId={getNested(currentSession, "account.id", undefined)}
              portalId={parseInt(getNested(currentSession,"portal.id", undefined), 10) }
            >
              <Suspense>
                <Component router={Router} {...pageProps} />
                <NotificationContainer />
              </Suspense>
            </CommonProvider>
          </IntlProvider>
        </ReduxProvider>
      </AppContext.Provider>
    );
  }
}

export default withRedux(initializeStore)(withCurrentSession(GO1App, {
  http,
}));
