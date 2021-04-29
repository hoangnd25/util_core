import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Banner } from '@go1d/go1d';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { MicrosoftAzurePage, microsoftAzureService } from '@src/pages/r/app/portal/integrations/azure';
import {contentDistributorService} from "@src/components/ContentDistributorExport";
import {exportStatusMock,mockCustomCollectionResponse} from "@src/components/ContentDistributorExport/index.test";
const mockStore = configureMockStore();

jest.spyOn(contentDistributorService, 'getExportStatus').mockResolvedValue(exportStatusMock);
jest.spyOn(contentDistributorService, 'getCustomContent').mockResolvedValue(mockCustomCollectionResponse);

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
      mail: 'test@go1.com',
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
        login_version: 'peach',
      },
    },
    account: {
      id: 123,
      isAdministrator: true,
      mail: 'test@go1.com',
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

it('Should render without crashing', (done) => {
  setup();
  done();
});

it('Should render with no connection', async () => {
  delete window.location;
  window.location = { ...window.location, assign: jest.fn() };

  spyOn(microsoftAzureService, 'getConnection').and.callFake(() => Promise.resolve(null));
  spyOn(microsoftAzureService, 'getRedirectLink').and.callFake(() => Promise.resolve('https://test.com'));

  const wrapper = setup();
  setImmediate(async () => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Connect with Microsoft');

    const Page = wrapper.find(MicrosoftAzurePage);
    await (Page.instance() as any).handleConnect();
    expect(window.location.assign).toHaveBeenCalled();
  });
});

it('Should render with connection', (done) => {
  const wrapper = setup();
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Reconnect with Microsoft');
    done();
  });
});

it('Should render error message - SSO:PortalNotFound', (done) => {
  const wrapper = setup({ error_code: 'SSO:PortalNotFound' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find(Banner).length).toBe(1);
    done();
  });
});

it('Should render error message - default', (done) => {
  const wrapper = setup({ error_code: 'undefined' });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find(Banner).length).toBe(1);
    done();
  });
});
