import { mount } from 'enzyme';
import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { Oracle, portalService } from '@src/pages/r/app/portal/integrations/oracle';

import { contentDistributorService } from '@src/components/ContentDistributorExport';
import { exportStatusMock, mockCustomCollectionResponse } from '@src/components/ContentDistributorExport/index.test';
import { CurrentSessionType } from '@src/types/user';

const mockIntegrationDataResponse = {
  domain: 'test domain',
  username: 'testusername',
  password: 'testpassword',
};
jest.spyOn(portalService, 'fetchIntegrationConfiguration').mockResolvedValue(mockIntegrationDataResponse);
jest.spyOn(portalService, 'saveIntegrationConfiguration').mockResolvedValue(mockIntegrationDataResponse);
jest.spyOn(contentDistributorService, 'getExportStatus').mockResolvedValue(exportStatusMock);
jest.spyOn(contentDistributorService, 'getCustomContent').mockResolvedValue(mockCustomCollectionResponse);

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
      mail: 'test@go1.com',
      data: {
        theme: {},
      },
      featureToggles: [],
      files: {},
      type: 'customer',
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
      mail: 'test@go1.com',
      isAdministrator: true,
      uuid: '00000000-0000-0000-00000000',
    },
  } as CurrentSessionType;

  const mockStore = configureMockStore();

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
        <Oracle currentSession={currentSession} {...componentProps} />
      </CommonProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', (done) => {
  setup();
  done();
});

it('Should get account data to portal config', async () => {
  const Element = setup();
  const Page = Element.find(Oracle);

  await (Page.instance() as any).fetchAccountData();
  Page.setState({ customContentCollection: true });
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('accountData')).toEqual(mockIntegrationDataResponse);
  expect(Page.state('customContentCollection')).toBeTruthy();
});

it('Should SAVE account data to portal config', async () => {
  const Element = setup();
  const Page = Element.find(Oracle);
  await (Page.instance() as any).saveAccountData();
  await (Page.instance() as any).fetchAccountData();
  expect(portalService.saveIntegrationConfiguration).toHaveBeenCalled();
  expect(portalService.fetchIntegrationConfiguration).toHaveBeenCalled();
  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('accountData')).toEqual(mockIntegrationDataResponse);
});
