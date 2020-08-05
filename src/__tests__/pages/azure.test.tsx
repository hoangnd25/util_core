import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { MicrosoftAzurePage, microsoftAzureService } from '@src/pages/r/app/portal/integrations/azure';

const mockStore = configureMockStore();

jest.spyOn(microsoftAzureService, 'getConnection').mockResolvedValue({
  id: '123',
  name: 'test',
  identifier: '123',
  strategy: '',
  provider: 'azure',
  links: {
    authorize: 'http://test.com'
  }
});

const setup = (props = {}, query = {}) => {
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
          <MicrosoftAzurePage router={{ query }} currentSession={currentSession} {...props} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', () => {
  setup();
});

it('Should render with no connection', (done) => {
  spyOn(microsoftAzureService, 'getConnection').and.callFake(() => Promise.resolve(null));

  const wrapper = setup();
  setImmediate(async () => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Connect with Microsoft Azure');

    const Page = wrapper.find(MicrosoftAzurePage);
    await (Page.instance() as any).handleConnect();
    done();
  });
});

it('Should render with connection', () => {
  const wrapper = setup();
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Reconnect with Microsoft Azure');
  });
});

it('Should render error message - SSO:PortalNotFound', () => {
  const wrapper = setup({}, { error_code: 'SSO:PortalNotFound' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});

it('Should render error message - SSO:UnknownIdentityProvider', () => {
  const wrapper = setup({}, { error_code: 'SSO:UnknownIdentityProvider' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});

it('Should render error message - SSO:PermissionDenied', () => {
  const wrapper = setup({}, { error_code: 'SSO:PermissionDenied' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});

it('Should render error message - SSO:InternalServerError', () => {
  const wrapper = setup({}, { error_code: 'SSO:InternalServerError' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});

it('Should render error message - SSO:ProviderError', () => {
  const wrapper = setup({}, { error_code: 'SSO:ProviderError' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});

it('Should render error message - default', () => {
  const wrapper = setup({}, { error_code: 'undefined' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
  });
});
