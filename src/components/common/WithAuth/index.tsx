import { getNested } from '@go1d/mine/utils';
import { getBaseUrl, getConfigValue } from '@src/config';
import { USER_UPDATE } from '@src/reducers/session';
import { CurrentSessionType } from '@src/types/user';
import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { AppContext } from 'next/app';
import { LoadingSpinner } from '../Suspense';
import UserService, { removeSession, saveSession } from './services/userService';
import isAdminRole from '@src/utils/isAdminRole';

/**
 * The following HOC is used to enable protected routes and inject the "currentSession" object in to the page
 */

const WithAuthComponent = AppPage =>
  class extends React.Component<any, any> {
    // proxy getInitialProps through
    public static async getInitialProps(ctx) {
      return {
        ...(AppPage.getInitialProps ? await AppPage.getInitialProps(ctx) : {}),
      };
    }

    // check auth status and redirect to login if not
    public render() {
      const { currentSession } = this.props;
      if (currentSession && currentSession.authenticated === true) {
        return <AppPage {...this.props} />;
      }
      if (typeof window !== 'undefined') {
        window.location.assign(
          `${getConfigValue('LOGIN_REDIRECT_URL', '/login')}?redirect_url=${encodeURIComponent(
            window.location.pathname
          )}${encodeURIComponent(window.location.search)}`
        );
      }
      return <LoadingSpinner />;
    }
  };

export const mapCurrentSessionToProps = state => ({ currentSession: state.currentSession });

const withAuth = AppPage =>
  connect(
    mapCurrentSessionToProps,
    null
  )(WithAuthComponent(AppPage));

export default withAuth;

/**
 * The following HOC is used to authenticate the user and inject the "currentSession" object in to _app.js, do not use else where!
 */
export const withCurrentSession = (App, helpers) =>
  class Auth extends React.Component<any, any> {
    public static displayName = 'Authentication';

    public static async getInitialProps(appCtx: AppContext) {
      const { http } = helpers;
      const {
        router: { query },
        ctx: { req, store },
      } = appCtx;
      let appProps = {};
      let currentSession = null;

      // Only perform on server
      if (typeof window === 'undefined') {
        try {
          const cookies = new Cookies(req.headers.cookie);
          currentSession = await UserService(http).performAuth(
            getNested(cookies, 'cookies.go1', null),
            (query.oneTimeToken as string) || null
          );
          store.dispatch({
            type: USER_UPDATE,
            payload: {
              ...currentSession,
            },
          });
        } catch (err) {
          // Do nothing, Login failed on server side, either due wrong credentials or missing credentials
        }
      }

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appCtx);
      }

      if (appCtx.ctx.isServer && !appCtx.ctx.pathname.includes('access-denied')) {
        if (!isAdminRole(currentSession)) {
          appCtx.ctx.res.writeHead(302, {
            Location: '/r/app/portal/access-denied'
          });
          return appCtx.ctx.res.end();
        }
      };

      return {
        ...appProps,
        currentSession,
      };
    }

    constructor(props) {
      super(props);
      this.state = {
        currentSession: props.currentSession,
      };
    }

    public componentDidMount() {
      const { currentSession } = this.state;
      const {
        router,
        router: { query, asPath, pathname },
        store,
      } = this.props;
      const { http } = helpers;
      const oneTimeToken = query.oneTimeToken || null;
      // Server side did not result in a login
      if (!currentSession) {
        // try login with local storage
        // Send one time token again on the frontend to log existing user out if oneTimeToken is invalid
        UserService(http)
          .performAuth(null, oneTimeToken)
          .then(
            (currentSessionData: CurrentSessionType) => {
              this.setState({ currentSession: currentSessionData });
              saveSession(currentSessionData);
              store.dispatch({
                type: USER_UPDATE,
                payload: {
                  ...currentSessionData,
                },
              });
            },
            err => {
              removeSession();
              this.setState({ currentSession: { authenticated: false } });
              router.push(`${getBaseUrl()}/access-denied`);
            }
          );
      } else if (
        currentSession.authenticated === true &&
        currentSession.account.isAdministrator &&
        !currentSession.account.isContentAdministrator
      ) {
        saveSession(currentSession);
      } else {
        router.push(`${getBaseUrl()}/access-denied`)
      }

      if (oneTimeToken) {
        // @TODO Find a way to get rid of one time token in the url without tirggering rerender.
        router.replace(pathname, asPath.replace(`oneTimeToken=${oneTimeToken}`, ''), { shallow: true });
      }
    }

    public render() {
      const { currentSession: currentSessionState } = this.state as { currentSession: CurrentSessionType };
      const { currentSession, ...restProps } = this.props;
      // currentSession is saved to redux in withReduxStore.tsx
      return <App {...restProps} currentSession={currentSessionState} />;
    }
  };
