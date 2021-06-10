import { mount } from 'enzyme';
import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';

import { CanvasLMSPage } from '@src/pages/r/app/portal/integrations/canvas';
import { canvasService } from '@src/services/canvasService/useCanvasService';
import { CurrentSessionType } from '@src/types/user';

const mockStore = configureMockStore();

jest.spyOn(canvasService, 'getConfig').mockResolvedValue([
  {
    id: 123,
    connection_name: 'connection_name',
    connection_identifier: 'connection_identifier',
    strategy: 'oauth 2.0',
    portal_id: 456,
    user_id_attribute: 'user_id_attribute',
    user_id_value: 'user_id_value',
    enabled: '1',
    created_time: 123123123,
    updated_time: 123123123,
    identity_provider: 'identity_provider',
    configuration: {
      auth_url: '/login/oauth2/auth',
      token_url: '/login/oauth2/token',
      domain: 'domain',
      client_id: 'client_id',
      client_secret: 'client_secret',
    },
  },
]);

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
      mail: 'test@go1.com',
      isAdministrator: true,
      uuid: '00000000-0000-0000-00000000',
    },
  } as CurrentSessionType;

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
        <CanvasLMSPage router={{ query }} currentSession={currentSession} />
      </CommonProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', async (done) => {
  setup();
  done();
});

it('Should render with connection', async (done) => {
  const wrapper = setup();
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find('Field').at(0).find('input').props().value).toEqual('domain');
    expect(wrapper.find('Field').at(1).find('input').props().value).toEqual('client_id');
    expect(wrapper.find('Field').at(2).find('input').props().value).toEqual('client_secret');
    expect(wrapper.find('SubmitButton').text()).toEqual('Update');
    done();
  });
});
