import Enzyme, { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { Oracle, contentDistributorService, portalService } from '@src/pages/r/app/portal/integrations/oracle';

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
    portal: {
      id: 123,
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
            <Oracle intl={intlMock} currentSession={currentSession} {...componentProps} />
          </CommonProvider>
        </IntlProvider>
      </ReduxProvider>
    );
};

it('Should render without crashing', () => {
    setup();
});

it('Should render custom content total', async () => {
  const mockCustomCollectionResponse = {
    default_collection: {
      id: '1583',
      type: 'default',
      machine_name: 'default',
      title: 'default',
      status: '1',
      portal_id: '8259249',
      author_id: '1459371',
      data: 'null',
      timestamp: '1586311405',
      created: '1586311405',
      updated: '1586311405',
    },
    paid: 2833,
    subscribe: 0,
    custom: 2,
    share: 0,
    custom_share: 0,
    free: 15654,
  };
  spyOn(contentDistributorService, 'getCustomContent').and.callFake(() =>
      Promise.resolve(mockCustomCollectionResponse)
  );
  const Element = setup();
  const Page = Element.find(Oracle);
  await (Page.instance() as any).fetchContentSelection();
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('customContentCollection')).toEqual(mockCustomCollectionResponse);
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

it('Should export content', async () => {
  const mockExportData = { portalId: '123', type: 'oracle' };
  const exportStatusMock = {
    timestamp: 1586391483247,
    status: 'queued',
  };
  const Element = setup();
  const Page = Element.find(Oracle);
  spyOn(contentDistributorService, 'exportContent').and.callFake(() => Promise.resolve(mockExportData));
  spyOn(contentDistributorService, 'getExportStatus').and.callFake(() => Promise.resolve(exportStatusMock));
  await (Page.instance() as any).contentDistributorExport();
  await (Page.instance() as any).getContentDistributorStatus();
  expect(contentDistributorService.exportContent).toHaveBeenCalled();
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('exportStatus')).toEqual(exportStatusMock);
});
