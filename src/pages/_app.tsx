import * as React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { NotificationContainer, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import CommonProvider from '@go1d/mine/common/Provider';
import Router from "next/router";
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import Cookies from 'universal-cookie';
import { setRuntimeVariable } from '@src/reducers/runtime';
import Suspense, { LoadingSpinner } from '@src/components/common/Suspense';
import LinkComponent from '@src/components/common/Link';
import AppContext from '@src/utils/appContext';
import createHttp from '@src/utils/http';
import { withCurrentSession } from '@src/components/common/WithAuth';
import { CurrentSessionType } from '@src/types/user';
import config from '@src/config';
import initializeStore from '@src/store/configureStore';
import { ReduxState } from '@src/types/reducers';

const cookies = new Cookies();
const http = createHttp();

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

    const { ctx: { query = {}, store } } = ctx;
    // Replace with External flag in JWT in near future
    if(query.embedded === "true") {
      store.dispatch(setRuntimeVariable({ name: "embeddedMode", value: true }));
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

    // Make sure front end http instance has jwt set.
    if (currentSession.jwt) {
      http.setJWT(currentSession.jwt);
    }

    return (
      <AppContext.Provider value={context}>
        <ReduxProvider store={store}>
          {/* This component should connect to redux (`currentSession`) instead of just rendering once with props returned from server */}
          <Main>
            <Suspense>
              <Component router={Router} {...pageProps} />
              <NotificationContainer />
            </Suspense>
          </Main>
        </ReduxProvider>
      </AppContext.Provider>
    );
  }
}

const Main: React.FunctionComponent = ({ children }) => {
  const currentSession = useSelector<ReduxState, ReduxState['currentSession']>((state) => {
    return state.currentSession;
  });

  return (
    <CommonProvider
        linkComponent={LinkComponent}
        accent={getNested(currentSession, 'portal.data.theme.primary', foundations.colors.accent)}
        pushNavigationState={Router.push}
        apiUrl={config.apiEndpoint}
        jwt={currentSession.jwt}
        accountId={getNested(currentSession, "account.id", undefined)}
        portalId={parseInt(getNested(currentSession,"portal.id", undefined), 10) }
      >
        {children}
      </CommonProvider>
  )
}

export default withRedux(initializeStore)(withCurrentSession(GO1App, {
  http,
}));
