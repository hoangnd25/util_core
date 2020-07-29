import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { MicrosoftAzurePage, microsoftAzureService } from '@src/pages/r/app/portal/integrations/microsoft-azure';

const mockStore = configureMockStore();

const setup = (props = {}) => {
  const currentSession = {
    authenticated: true,
    portal: {
      id: '123',
      title: 'test.mygo1.com',
      data: {},
      featureToggles: [],
      files: {},
      configuration: {
        integrations: {
          oracle: {
            domain: 'test domain',
            username: 'testusername',
            password: 'testpassword',
          },
        },
      },
    },
    account: {
      id: 123,
      isAdministrator: true,
      uuid: '00000000-0000-0000-00000000',
    },
  };

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
          <MicrosoftAzurePage router={{ query: {}}} currentSession={currentSession} {...props} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', () => {
  setup();
});

it('Should render with no connection', () => {
  spyOn(microsoftAzureService, 'getConnection').and.callFake(() => Promise.resolve(null));

  const ComponentWrapper = setup();
  // const hasApplicationID = ComponentWrapper.find('View[data-testid="scormAndXApi.hasApplicationID"]');
  // expect(hasApplicationID).not.toBeNull();
});

it('Should render with connection', () => {
  spyOn(microsoftAzureService, 'getConnection').and.callFake(() => Promise.resolve({id: 123}));

  const ComponentWrapper = setup();
  // const hasApplicationID = ComponentWrapper.find('View[data-testid="scormAndXApi.hasApplicationID"]');
  // expect(hasApplicationID).not.toBeNull();
});
