import { NotificationContainer, Provider as Go1dProvider, resetCSS } from '@go1d/go1d';
import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import LinkComponent from '../components/LinkComponent';
import Suspense from '../components/Suspense';
import { withUser } from '../components/WithUser';
import ErrorPage from './ErrorPage';
import OverviewPage from './OverviewPage';

resetCSS();

const ContextType = {
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  cookies: PropTypes.any,
  http: PropTypes.any,
};

class App extends React.PureComponent<any> {
  public static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
  };

  public static childContextTypes = ContextType;

  public getChildContext() {
    return this.props.context;
  }

  public render() {
    const { account = {} } = this.props;

    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <Go1dProvider linkComponent={LinkComponent}>
        <Suspense fallback={'loading'}>
          <IntlProvider locale="en">
            <Switch>
              {account.id && <Route path="/:id" component={OverviewPage} />}
              <Route component={ErrorPage} />
            </Switch>
          </IntlProvider>
        </Suspense>
        <NotificationContainer />
      </Go1dProvider>
    );
  }
}

export default withUser(App);
