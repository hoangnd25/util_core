import React from 'react';
import {connect} from "react-redux";
import Cookies from 'universal-cookie';
import { PortalModel } from '@go1d/go1d-exchange';
import UserService, { saveSession, removeSession } from '../../services/userService';
import {CurrentSessionType} from "../../types/user";
import {LoadingSpinner} from "../Suspense";

/**
 * The following HOC is used to enable protected routes and inject the "currentSession" object in to the page
 */

const WithAuthComponent = AppPage =>  class extends React.Component<any,any> {
  // proxy getInitialProps through
  public static async getInitialProps(ctx) {
    return {
      ...(AppPage.getInitialProps ? await AppPage.getInitialProps(ctx) : {})
    }
  }

  // check auth status and redirect to login if not
  public render() {
    const { currentSession } = this.props;
    const isAuthenticated = currentSession && currentSession.authenticated === true;

    if (isAuthenticated) {
      if (currentSession.account && currentSession.account.isAdministrator) {
        return <AppPage {...this.props} />;
      }

      if (typeof window !== 'undefined') {
        window.location.assign('/p/#/app/dashboard');
      }
    } else if (typeof window !== 'undefined') {
      const windowLocation = window.location;
      windowLocation.assign(`${windowLocation.origin}/p/#/access/signin?redirectUrlAfterLogin=${windowLocation.href}`);
    }

    return <LoadingSpinner />
  }
};

export const mapCurrentSessionToProps = state => ({ currentSession: state.currentSession });

const withAuth = AppPage => connect(
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

        public static async getInitialProps(ctx) {
          const { http } = helpers;
          const {
            router: { query },
            ctx: { req },
          } = ctx;
          let appProps = {};
          let currentSession = null;

          if (App.getInitialProps) {
            appProps = await App.getInitialProps(ctx);
          }
          // Only perform on server
          if (typeof window === 'undefined') {
            try {
              currentSession = await UserService(http).performAuth(
                new Cookies(req.headers.cookie),
                query.oneTimeToken || null
              );
            } catch (err) {
              // Do nothing, Login failed on server side, either due wrong credentials or missing credentials
            }
          }
          return {
            ...appProps,
            currentSession
          };
        }

        constructor(props) {
          super(props);
          this.state = {
            currentSession: props.currentSession
          };
        }

        public componentDidMount() {
          const { currentSession } = this.state;
          const { router, router: {query, asPath, pathname} } = this.props;
          const { http } = helpers;
          const oneTimeToken = query.oneTimeToken || null;
          // Server side did not result in a login
          if (!currentSession) {
            // try login with local storage
            // Send one time token again on the frontend to log existing user out if oneTimeToken is invalid
            UserService(http)
              .performAuth(null, oneTimeToken)
              .then(
                currentSessionData => {
                  this.setState({ currentSession: currentSessionData });
                  saveSession(currentSessionData as CurrentSessionType);
                },
                err => {
                  removeSession();
                  this.setState({ currentSession: { authenticated: false} });
                }
              );
          } else if (currentSession.authenticated === true) {
            saveSession(currentSession);
          }

          if (oneTimeToken) {
            // @TODO Find a way to get rid of one time token in the url without tirggering rerender.
            router.replace(pathname, asPath.replace(`oneTimeToken=${oneTimeToken}`, ""), { shallow: true });
          }

        }

        public render() {
          const { currentSession : currentSessionState  } = this.state as {currentSession: CurrentSessionType};
          const { currentSession, ...restProps } = this.props;
          // currentSession is saved to redux in withReduxStore.tsx
          return <App {...restProps} currentSession={currentSessionState} />;
        }
  };
