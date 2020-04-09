import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from "react-redux";
import { CurrentSessionType } from "@src/types/user";
import UserService, { saveSession, removeSession } from '@src/services/userService';
import { LoadingSpinner } from "@src/components/common/Suspense";
import extractGo1Metadata from '@src/utils/helper';
import featureToggleService from '@src/services/featureToggleService';

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

        public async componentDidMount() {
          const { currentSession } = this.state;
          const { router, router: { query, asPath, pathname } } = this.props;
          const { http } = helpers;
          const oneTimeToken = query.oneTimeToken || null;
          // Server side did not result in a login
          if (!currentSession) {
            // try login with local storage
            // Send one time token again on the frontend to log existing user out if oneTimeToken is invalid
            try {
              await UserService(http)
                .performAuth(null, oneTimeToken)
                .then(
                  currentSessionData => {
                    this.setState({ currentSession: currentSessionData });
                    saveSession(currentSessionData as CurrentSessionType);
                  },
                  () => {
                    removeSession();
                    this.setState({ currentSession: { authenticated: false } });
                  }
                );
            } catch (err) {
              // Do nothing, Login failed
            }
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

/**
 * The following HOC is used to inject the "featureToggles" object
 */
export const withFeatureToggles = (App, helpers) =>
  class FeatureToggles extends React.Component<any, any> {
    static displayName = 'FeatureToggles';

    public static async getInitialProps(ctx) {
      const { http } = helpers;
      const {
        ctx: { req },
      } = ctx;
      let appProps = {};
      let featureToggles = {};

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (typeof window === 'undefined') {
        try {
          const go1Cookie = new Cookies(req.headers.cookie);
          const { portalName } = extractGo1Metadata(go1Cookie);
          featureToggles = await featureToggleService(http).getFeatures(portalName);
        } catch(err) {}
      }

      return {
        ...appProps,
        featureToggles,
      };
    }

    constructor(props) {
      super(props);

      this.state = {
        featureToggles: props.featureToggles,
      };
    }

    componentDidMount() {
      this.fetchFeatureToggles();
    }

    render() {
      const { featureToggles: featureTogglesState } = this.state;
      const { featureToggles, ...restProps } = this.props;

      if (featureTogglesState) {
        return <App {...restProps} featureToggles={featureTogglesState} />;
      }

      return <App {...this.props} />;
    }

    private async fetchFeatureToggles() {
      const { featureTogglesState } = this.state;

      // Server side did not resolve `featureToggles`
      if (!featureTogglesState) {
        const { http } = helpers;
        const { portalName } = extractGo1Metadata();
        const featureToggles = await featureToggleService(http).getFeatures(portalName);

        this.setState({ featureToggles });
      }
    }
  };
