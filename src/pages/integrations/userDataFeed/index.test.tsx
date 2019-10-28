import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from "redux-mock-store";
import { UserDataFeed } from './index';

const setup = (props = {}) => {
  const currentSession = {
    portal: {
      id: 123,
    },
    account: {
      isAdministrator: true,
    },
  };
  const mockStore = configureMockStore();
  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <UserDataFeed currentSession={currentSession} {...props} />
      </IntlProvider>
    </ReduxProvider>
  );
};

// it('renders without crashing step = 0', () => {
//   setup();
// });
//
// it('renders without crashing step = 1', () => {
//   const Element = setup();
//   const Page = Element.find(UserDataFeed);
//   Page.setState({ step: 1 });
// });
