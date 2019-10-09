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
          `${getConfigValue('LOGIN_REDIRECT_URL', '/p/#/access/signin')}?redirect=${encodeURIComponent(
            window.location.pathname)}${encodeURIComponent(window.location.search)}`);
      }
      return <LoadingSpinner/>
    
  }
};

const mapStateToProps = state => ({ currentSession: state.currentSession });

const withAuth = AppPage => connect(
  mapStateToProps,
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
            router: { asPath, query },
            ctx: { req },
          } = ctx;
          const cookies = {}; // Cookie login deactivated for now. If somebody changes portal or logs in as a different person, Apiom will not store the new information in cookies.

          // to activate cookies: const cookies = new Cookies(req.headers.cookies);

          let appProps = {};
          let currentSession = null;

          if (App.getInitialProps) {
            appProps = await App.getInitialProps(ctx);
          }
          // Only perform on server
          if (typeof window === 'undefined') {
            try {
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
            currentSession,
            currentPath: asPath
          };
        }

        constructor(props) {
          super(props);
          this.state = {
            currentSession: null,
          };
        }

        public componentDidMount() {
          const { currentSession } = this.props;
          const { http } = helpers;
          // Server side did not result in a login
          if (!currentSession) {
            // try login with local storage
            UserService(http)
              .performAuth(null, null)
              .then(
                data => {
                  this.setState({ currentSession: { authenticated: true, ...data} });
                },
                err => {
                  this.setState({ currentSession: { authenticated: false} });
                }
              );
          }
        }

        public render() {
          const { currentSession: currentSessionState } = this.state;
          const { currentSession: currentSessionProps, ...restProps } = this.props;
          const currentSession = (currentSessionProps || currentSessionState) as CurrentSessionType;
          if (currentSession && currentSession.authenticated === true) {
            // store user login in cookie and local storage, will only be done browser side
            saveSession(currentSession);
          }
          return <App {...restProps} currentSession={currentSession} />;
        }
  };
