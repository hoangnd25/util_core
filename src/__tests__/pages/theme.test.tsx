import Enzyme, { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeSettingsPage } from '@src/pages/r/app/portal/settings/theme';

Enzyme.configure({ adapter: new Adapter() });



const setup = (props = {}, isLoading = false) => {
  const componentProps = {
    ...props,
    scrollToTop: jest.fn(),
  };

  const currentSession = {
    authenticated: true,
    portal: {
      id: '123',
      title: 'test.mygo1.com',
      data: {},
      featureToggles: [],
      files: {},
      configuration: {},
      },
    account: {
      id: 123,
      isAdministrator: true,
      uuid: '00000000-0000-0000-00000000',
    },
  };

  const mockStore = configureMockStore();

    return mount(
      <ReduxProvider store={mockStore({ currentSession })}>
        <IntlProvider locale="en">
          <CommonProvider
            pushNavigationState={jest.fn()}
            apiUrl="api.go1.co"
            jwt="jwt"
            accountId={123}
            portalId={456}
          >
            <ThemeSettingsPage currentSession={currentSession} {...componentProps} />
          </CommonProvider>
        </IntlProvider>
      </ReduxProvider>
    );
};

it('Should render without crashing', () => {
    const ComponentWrapper = setup();
    expect(ComponentWrapper.find('View[data-testid="theme_settings_page"]').length).toBe(1);
});



