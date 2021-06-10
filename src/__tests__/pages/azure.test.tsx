import { mount } from 'enzyme';
import * as React from 'react';
import { Banner } from '@go1d/go1d';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { MicrosoftAzurePage, microsoftAzureService } from '@src/pages/r/app/portal/integrations/azure';
import { contentDistributorService } from '@src/components/ContentDistributorExport';
import { exportStatusMock, mockCustomCollectionResponse } from '@src/components/ContentDistributorExport/index.test';
import { CurrentSessionType } from '@src/types/user';

const mockStore = configureMockStore();

jest.spyOn(contentDistributorService, 'getExportStatus').mockResolvedValue(exportStatusMock);
jest.spyOn(contentDistributorService, 'getCustomContent').mockResolvedValue(mockCustomCollectionResponse);

const setup = (query = {}) => {
  const currentSession = {
    authenticated: true,
    portal: {
      id: '123',
      title: 'test.mygo1.com',
      mail: 'test@go1.com',
      type: 'customer',
      data: {
        theme: {},
      },
      featureToggles: [],
      files: {},
      configuration: {},
    },
    account: {
      id: 123,
      isAdministrator: true,
      mail: 'test@go1.com',
      uuid: '00000000-0000-0000-00000000',
    },
  } as CurrentSessionType;

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
        <MicrosoftAzurePage router={{ query }} currentSession={currentSession} />
      </CommonProvider>
    </ReduxProvider>
  );
};

beforeEach(() => {
  jest.spyOn(microsoftAzureService, 'getConnection').mockResolvedValue({
    id: '123',
    name: 'test',
    identifier: '123',
    strategy: '',
    provider: 'azure',
    links: {
      authorize: 'http://test.com',
    },
  });
});

it('Should render without crashing', () => {
  setup();
});

it('Should render with no connection', async (done) => {
  delete window.location;
  window.location = { ...window.location, assign: jest.fn() };

  jest.spyOn(microsoftAzureService, 'getConnection').mockImplementation(() => Promise.resolve(null));
  jest.spyOn(microsoftAzureService, 'getRedirectLink').mockImplementation(() => Promise.resolve('https://test.com'));

  const wrapper = setup();
  setImmediate(async () => {
    wrapper.update();
    expect(wrapper.find('ButtonFilled').text()).toEqual('Connect with Microsoft');

    const Page = wrapper.find(MicrosoftAzurePage);
    await (Page.instance() as any).handleConnect();
    expect(window.location.assign).toHaveBeenCalled();

    done();
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
