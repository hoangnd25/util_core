import { mount } from 'enzyme';
import * as React from 'react';
import { withMasterPage } from '@src/pages/masterPage';
import { View } from '@go1d/go1d';
import CommonProvider from "@go1d/mine/common/Provider";
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from "react-redux";
import configureMockStore from "redux-mock-store";

const intlFuncMock = jest.fn();
const currentSessionMock = {
  portal: {
    id: 123,
    configuration: {
      integrations: {},
    },
  },
  account: {
    id: 123,
    isAdministrator: true,
  },
};

const setup = (
  props = {},
  options = { parentPage: 'integration', childPage: 'scorm-and-xapi' },
  currentSession = currentSessionMock,
) => {
  const Component = withMasterPage(() => <View />, options);
  Component.displayName = 'TestComponent';

  const featureToggles = {};
  const mockStore = configureMockStore();
  const intlMock = { formatMessage: intlFuncMock };

  const mainProps = {
    currentSession,
    featureToggles,
    ...props,
  };

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <CommonProvider
          pushNavigationState={jest.fn}
          apiUrl="go1.api.com"
          jwt="123"
          accountId={123}
          portalId={123}
        >
          <Component {...mainProps} intl={intlMock} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

afterEach(() => jest.clearAllMocks());

it('should no crash', () => {
  setup();
});

it('should return integration menus', () => {
  const Component = setup();
  const instance = Component.find('TestComponent').instance() as any;
  expect(instance.getSidebarMenus().length).toEqual(15);
});

it('should return data feed title', () => {
  const Component = setup({} ,  { parentPage: 'integration', childPage: 'user-data-feed' });
  const instance = Component.find('TestComponent').instance() as any;
  instance.getPageTitle();
  expect(intlFuncMock).toHaveBeenCalledWith({"defaultMessage": "User data feed", "id": "integrationUserDataFeed.pageTitle"});
  expect(intlFuncMock).not.toHaveBeenCalledWith({"defaultMessage": "SCORM and xAPI", "id": "integrationScormAndXApiTitle.pageTitle"});
});

it('should return scorm title', () => {
  const Component = setup();
  const instance = Component.find('TestComponent').instance() as any;
  instance.getPageTitle();
  expect(intlFuncMock).toHaveBeenCalledWith({"defaultMessage": "SCORM and xAPI", "id": "integrationScormAndXApi.pageTitle"});
  expect(intlFuncMock).not.toHaveBeenCalledWith({"defaultMessage": "User data feed", "id": "integrationUserDataFeed.pageTitle"});
});

it('should return data feed active menu', () => {
  const Component = setup({} ,  { parentPage: 'integration', childPage: 'user-data-feed' });
  const instance = Component.find('TestComponent').instance() as any;
  expect(instance.getActiveMenu()).toEqual('sidebar.integrations-user-data-feed');
});

it('should return scorm active menu', () => {
  const Component = setup();
  const instance = Component.find('TestComponent').instance() as any;
  expect(instance.getActiveMenu()).toEqual('sidebar.integrations-scorm');
});

it('should not show `User Data Feed` menu', () => {
  const Component = setup();
  expect(Component.find('[data-testid="sidebar.integrations-user-data-feed"]')).toHaveLength(0);
});

it('should show `User Data Feed` menu with feature toggle', () => {
  const Component = setup({
    featureToggles: {
      'user-data-feed': true,
    },
  });
  expect(Component.find('[data-testid="sidebar.integrations-user-data-feed"]').length).toBeGreaterThan(0);
});

it('should show `User Data Feed` menu with portal configuration', () => {
  const currentSession= {
    portal: {
      id: 123,
      configuration: {
        integrations: {},
        data_mapping: true,
      },
    },
    account: {
      id: 123,
      isAdministrator: true,
    },
  };
  const Component = setup(undefined, undefined, currentSession);
  expect(Component.find('[data-testid="sidebar.integrations-user-data-feed"]').length).toBeGreaterThan(0);
});
