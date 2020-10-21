import MockAdapter from 'axios-mock-adapter';
import create from '@src/utils/http';
import canvasService from '.';

let mock: MockAdapter;
const http = create();

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

const mockConnections = [
  {
    id: 'connection_id',
    connection_name: 'connection_name',
    connection_identifier: 'connection_identifier',
    strategy: 'oauth 2.0',
    portal_id: 123,
    user_id_attribute: 'user_id_attribute',
    user_id_value: 'user_id_value',
    enabled: true,
    created_time: 123123,
    updated_time: 123123,
    identity_provider: 'canvas',
    configuration: {
      auth_url: '/login/oauth2/auth',
      token_url: '/login/oauth2/token',
      domain: 'go1.instructure.com',
      client_id: 'client_id',
      client_secret: 'client_secret',
    }
  }
]
const mockReponse = {
  redirectUrl: 'https://go1.instructure.com/authorized'
}

test('getConfig should return connection', async done => {
  mock.onGet(`sso/v2/connections/123?idps[]=canvas`).reply(200, mockConnections)
  const connections = await canvasService(http).getConfig('123')
  expect(connections).toStrictEqual(mockConnections)
  done()
})

test('setConfig should return authUrl', async done => {
  mock
    .onPost(`sso/v2/connections`).reply(200)
    .onGet(`sso/oauth/canvas/portal/authorize?portal=portal_name`).reply(200, mockReponse)
  const response = await canvasService(http).setConfig(
    'portal_id',
    'portal_name',
    { domain: 'domain', client_id: 'client_id', client_secret: 'client_secret' }
  )
  expect(response).toStrictEqual(mockReponse)
  done()
})

test('updateConfig should return authUrl', async done => {
  mock
    .onPut(`sso/v2/connections/123`).reply(200)
    .onGet(`sso/oauth/canvas/portal/authorize?portal=portal_name`).reply(200, mockReponse)
  const response = await canvasService(http).updateConfig(
    'portal_id',
    'portal_name',
    123,
    { domain: 'domain', client_id: 'client_id', client_secret: 'client_secret' }
  )
  expect(response).toStrictEqual(mockReponse)
  done()
})
