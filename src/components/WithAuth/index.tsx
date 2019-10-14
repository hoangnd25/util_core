import React from 'react';
import Cookies from 'universal-cookie';
import { getNested } from '@go1d/mine/utils';
import {connect} from "react-redux";
import UserService, { saveSession } from './services/userService';
import {CurrentSessionType} from "../../types/user";
import {getConfigValue} from "../../config";
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
    const {currentSession} = this.props;
    if (currentSession && currentSession.authenticated === true) {
      return <AppPage {...this.props} />;
    }
    if (typeof window !== 'undefined') {
      window.location.assign(
        `${getConfigValue('LOGIN_REDIRECT_URL', '/user/login')}?redirect_url=${encodeURIComponent(
          window.location.pathname)}${encodeURIComponent(window.location.search)}`);
    }
    return <LoadingSpinner/>

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
              const cookies = new Cookies(req.headers.cookie);
              currentSession = await UserService(http).performAuth(
                getNested(cookies, 'cookies.go1', null),
                getNested(query, 'oneTimeToken', null)
              );
            } catch (err) {
              // if err is null, that means no login information found, that's fine and expected. Promise.reject() is used
              if (err) {
                console.log(JSON.stringify(err));
              }
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
          const { http } = helpers;
          // Server side did not result in a login
          if (!currentSession) {
            // try login with local storage
            UserService(http)
              .performAuth(null, null)
              .then(
                currentSessionData => {
                  this.setState({ currentSession: currentSessionData });
                  saveSession(currentSessionData as CurrentSessionType);
                },
                err => {
                  this.setState({ currentSession: { authenticated: false} });
                }
              );
          } else if (currentSession.authenticated === true) {
            saveSession(currentSession);
          }
        }

        public render() {
          const { currentSession : currentSessionState  } = this.state as {currentSession: CurrentSessionType};
          const { currentSession, ...restProps } = this.props;

          // currentSession is saved to redux in withReduxStore.tsx
          return <App {...restProps} currentSession={currentSessionState} />;
        }
  };
