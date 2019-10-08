import React from 'react';
import Cookies from 'universal-cookie';
import { getNested } from '@go1d/mine/utils';
import UserService, { saveSession } from './services/userService';
import { getConfigValue } from '../../config';
import { LoadingSpinner } from '../Suspense';

export default (App, helpers) =>
  class Auth extends React.Component<any, any> {
        public static displayName = 'Authentication';

        public static async getInitialProps(ctx) {
          const { http } = helpers;
          const {
            router: { query },
            ctx: { req },
          } = ctx;
            // const cookies = new Cookies(req.headers.cookie) as any;
          const cookies = {}; // Cookie login deactivated for now. If somebody changes portal or logs in as a different person, it will not store the new information in cookies.
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
                  this.setState({ currentSession: data });
                },
                err => {
                  if (typeof window !== 'undefined') {
                    window.location.assign(getConfigValue('LOGIN_REDIRECT_URL', '/p/#/access/signin'));
                  }
                }
              );
          }
        }

        public render() {
          const { currentSession: currentSessionState } = this.state;
          const { currentSession: currentSessionProps, ...restProps } = this.props;
          const currentSession = currentSessionProps || currentSessionState;
          if (currentSession) {
            // store user login in cookie and local storage, will only be done browser side
            saveSession(currentSession);
            return <App {...restProps} currentSession={currentSession} />;
          }
          return <LoadingSpinner />;
        }
  };
