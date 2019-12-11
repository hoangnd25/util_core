import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_pt from 'react-intl/locale-data/pt';
import { NotificationContainer, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import CommonProvider from '@go1d/mine/common/Provider';
import Router from "next/router";
import App from 'next/app';
import Cookies from 'universal-cookie';
import qs from 'query-string';
import Suspense, { LoadingSpinner } from '@src/components/common/Suspense';
import LinkComponent from '@src/components/common/Link';
import withReduxStore from '@src/store/withReduxStore';
import AppContext from '@src/utils/appContext';
import createHttp from '@src/utils/http';
import { withCurrentSession, withFeatureToggles } from '@src/components/common/WithAuth';
import { CurrentSessionType } from '@src/types/user';
import config from '@src/config';
import { defaultLocale, countryToLocale, messages } from '@src/utils/translation';

const cookies = new Cookies();
const http = createHttp();
const noOP = () => null;

const context = {
  cookies,
  http,
};

addLocaleData([...locale_en, ...locale_pt]);

interface AppProps {
  reduxStore: any;
  currentSession: CurrentSessionType;
  featureToggles: Record<string, any>;
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

  public getLanguage(currentSession): string {
    if (!currentSession && typeof window !== 'undefined') {
      const { lang } = qs.parse(window.location.search) as { [key: string]: string };
      if (lang) {
        return lang;
      }

      return window.navigator ? window.navigator.language.split(/[-_]/)[0] : defaultLocale;
    }

    if (currentSession) {
      const { user, portal } = currentSession;

      if (user && user.locale) {
        return user.locale[0] || defaultLocale;
      }

      if (portal && portal.configuration) {
        return countryToLocale[portal.configuration.locale || 'AU'] || defaultLocale;
      }
    }

    return defaultLocale;
  }


  public render() {
    const { Component, pageProps, reduxStore, currentSession, featureToggles } = this.props;

    // Show loading if current Session has not been loaded
    if (currentSession === null) {
      // can be replaced with a skeleton
      return <LoadingSpinner />;
    }

    const language = this.getLanguage(currentSession);
    return (
      <AppContext.Provider value={context}>
        <ReduxProvider store={reduxStore}>
          <IntlProvider locale={language} messages={messages[language]} onError={noOP}>
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
                <Component router={Router} featureToggles={featureToggles} {...pageProps} />
                <NotificationContainer />
              </Suspense>
            </CommonProvider>
          </IntlProvider>
        </ReduxProvider>
      </AppContext.Provider>
    );
  }
}

export default withFeatureToggles(withCurrentSession(withReduxStore(GO1App, context), context), context);
