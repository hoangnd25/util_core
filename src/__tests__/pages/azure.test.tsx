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

const setup = (query = {}) => {
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
          <MicrosoftAzurePage router={{ query }} currentSession={currentSession} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', async () => {
  setup();
});

it('Should render with no connection', async (done) => {
  delete window.location;
  window.location = { ...window.location, assign: jest.fn() };

  spyOn(microsoftAzureService, 'getConnection').and.callFake(() => Promise.resolve(null));
  spyOn(microsoftAzureService, 'getRedirectLink').and.callFake(() => Promise.resolve('https://test.com'));

  const wrapper = setup();
  setImmediate(async () => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Connect with Microsoft Azure');

    const Page = wrapper.find(MicrosoftAzurePage);
    await (Page.instance() as any).handleConnect();
    expect(window.location.assign).toHaveBeenCalled();
    done();
  });
});

it('Should render with connection', async (done) => {
  const wrapper = setup();
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Reconnect with Microsoft Azure');
    done();
  });
});

it('Should render error message - SSO:PortalNotFound', async (done) => {
  const wrapper = setup({ error_code: 'SSO:PortalNotFound' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});

it('Should render error message - SSO:UnknownIdentityProvider', async (done) => {
  const wrapper = setup({ error_code: 'SSO:UnknownIdentityProvider' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});

it('Should render error message - SSO:PermissionDenied', async (done) => {
  const wrapper = setup({ error_code: 'SSO:PermissionDenied' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});

it('Should render error message - SSO:InternalServerError', async (done) => {
  const wrapper = setup({ error_code: 'SSO:InternalServerError' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});

it('Should render error message - SSO:ProviderError', async (done) => {
  const wrapper = setup({ error_code: 'SSO:ProviderError' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});

it('Should render error message - default', async (done) => {
  const wrapper = setup({ error_code: 'undefined' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Banner').length).toBe(1);
    done();
  });
});
