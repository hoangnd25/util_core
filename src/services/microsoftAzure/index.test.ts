import MockAdapter from 'axios-mock-adapter';
import create from '@src/utils/http';
import microsoftAzureService from './index';

let mock: MockAdapter;
const http = create();

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

test('should return azure connection for portal', async () => {
  const ssoConnectionResponse = [
    {"id":"16","name":"dev.mygo1.com - azure","identifier":"b15e91ba-5f5e-4633-99a2-cf63b8dd399a","strategy":"oauth 2.0","provider":"azure","links":{"authorize":"https:\/\/api-dev.go1.co\/sso\/oauth\/azure\/authorize?portal=dev.mygo1.com"}},
    {"id":"2475","name":"go1learning","identifier":"con_60BNykraMptXPwpA","strategy":"samlp","provider":"go1-auth0","links":{"authorize":"https:\/\/api-dev.go1.co\/sso\/wsfed\/103116"}}
  ];
  mock.onGet(`sso/public/connections/test.mygo1.com`).reply(200, ssoConnectionResponse);
  const ssoConnection = await microsoftAzureService(http).getConnection('test.mygo1.com');
  expect(ssoConnection).toStrictEqual({"id":"16","name":"dev.mygo1.com - azure","identifier":"b15e91ba-5f5e-4633-99a2-cf63b8dd399a","strategy":"oauth 2.0","provider":"azure","links":{"authorize":"https:\/\/api-dev.go1.co\/sso\/oauth\/azure\/authorize?portal=dev.mygo1.com"}});
});

test('should return azure connection link for portal', async () => {
  const redirectLinkResponse = {
    redirectUrl: 'https://api-dev.go1.co/sso/oauth/azure/authorize?portal=dev.mygo1.com'
  };
  mock.onGet(`sso/oauth/azure/portal/authorize?portal=dev.mygo1.com`).reply(200, redirectLinkResponse);
  const redirectLink = await microsoftAzureService(http).getRedirectLink('dev.mygo1.com');
  expect(redirectLink).toStrictEqual(redirectLinkResponse.redirectUrl);
});
