import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { NotificationContainer, Provider as Go1dProvider, globalCSS, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import App from 'next/app';
import Cookies from 'universal-cookie';
import Suspense from '../components/Suspense';
import LinkComponent from '../components/Link';
import withReduxStore from '../store/withReduxStore';
import AppContext from '../utils/appContext';
import createHttp from '../utils/http';
import { USER_UPDATE as USER_UPDATE_ACTION } from '../reducers/account';
import withAuthServerSide from '../components/WithAuth';
import { CurrentSessionType } from '../types/user';

const cookies = new Cookies();
const http = createHttp();

interface AppProps {
    reduxStore: any;
    currentSession: CurrentSessionType;
}

export class GO1App extends App<AppProps, any> {
  public render() {
    const { Component, pageProps, reduxStore, currentSession } = this.props;

    if (currentSession) {
      reduxStore.dispatch({
        type: USER_UPDATE_ACTION,
        payload: { ...currentSession },
      });
    }

    const context = {
      store: reduxStore,
      cookies,
      http,
    };

    return (
      <AppContext.Provider value={context}>
            <ReduxProvider store={context.store}>
                    <Go1dProvider
                      linkComponent={LinkComponent}
                      accent={getNested(currentSession, 'portal.data.theme.primary', foundations.colors.accent)}
                      logo={getNested(currentSession, 'portal.files.logo', null)}
                    >
                    <Suspense showLoading={!currentSession}>
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

export default withAuthServerSide(withReduxStore(GO1App, { cookies, http }), {
  http,
});
