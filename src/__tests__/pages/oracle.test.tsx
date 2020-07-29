import Enzyme, { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { Oracle, portalService } from '@src/pages/r/app/portal/integrations/oracle';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const intlMock = {
  formatMessage: jest.fn(),
};

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
            <Oracle currentSession={currentSession} {...componentProps} />
          </CommonProvider>
        </IntlProvider>
      </ReduxProvider>
    );
};

it('Should render without crashing', () => {
    setup();
});

it('Should get account data to portal config', async () => {
  const mockIntegrationDataResponse = {
    domain: 'test domain',
    username: 'testusername',
    password: 'testpassword',
  };

  const Element = setup();
  const Page = Element.find(Oracle);

  spyOn(portalService, 'fetchIntegrationConfiguration').and.callFake(() =>
      Promise.resolve(mockIntegrationDataResponse)
  );
  await (Page.instance() as any).fetchAccountData();
  Page.setState({ customContentCollection: true });
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('accountData')).toEqual(mockIntegrationDataResponse);
  expect(Page.state('customContentCollection')).toBeTruthy();
});

it('Should SAVE account data to portal config', async () => {
  const mockIntegrationDataResponse = {
    domain: 'Save Data Test',
    username: 'testusername',
    password: 'testpassword',
  };

  const Element = setup();
  const Page = Element.find(Oracle);

  spyOn(portalService, 'saveIntegrationConfiguration').and.callFake(() =>
      Promise.resolve(mockIntegrationDataResponse)
  );
  await (Page.instance() as any).saveAccountData();
  spyOn(portalService, 'fetchIntegrationConfiguration').and.callFake(() =>
      Promise.resolve(mockIntegrationDataResponse)
  );
  await (Page.instance() as any).fetchAccountData();
  expect(portalService.saveIntegrationConfiguration).toHaveBeenCalled();
  expect(portalService.fetchIntegrationConfiguration).toHaveBeenCalled();
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('accountData')).toEqual(mockIntegrationDataResponse);
});
