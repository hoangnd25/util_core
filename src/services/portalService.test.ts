import MockAdapter from 'axios-mock-adapter';
import create from '@src/utils/http';
import portalService from './portalService';

let mock: MockAdapter;
const http = create();

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

test('should return FALSE for data mapping configuratio', async () => {
  mock.onGet('/portal/conf/test.mygo1.com/GO1/data_mapping').reply(200, { data: 'false' });

  const dataMapping = await portalService(http).fetchCustomConfiguration('test.mygo1.com', 'data_mapping');
  console.log('should return FALSE for data mapping configuration', dataMapping);
  expect(dataMapping).toBe('false');
});

test('should return TRUE for data mapping configuratio', async () => {
  mock.onGet('/portal/conf/test.mygo1.com/GO1/data_mapping').reply(200, { data: 'true' });

  const dataMapping = await portalService(http).fetchCustomConfiguration('test.mygo1.com', 'data_mapping');
  expect(dataMapping).toBe('true');
});

test('should return integration data', async () => {
  const mockIntegrationData = {
    "data": {
      "domain": "test domain",
      "username": "testusername",
      "password": "testpassword"
    },
    "public": "0"
  }

  const mockIntegrationDataResponse =
  {
    domain: 'test domain',
    username: 'testusername',
    password: 'testpassword'
  }

  mock.onGet('portal/conf/test.mygo1.com/integrations/oracle').reply(200, mockIntegrationData);
  const integrationData = await portalService(http).fetchIntegrationConfiguration('test.mygo1.com', 'oracle');
  expect(integrationData).toStrictEqual(mockIntegrationDataResponse);
});

test('should post new integration data', async () => {
  const mockIntegrationData =
    { "domain": "Testing this domain23", "username": "45626", "password": "456566" }

  mock.onPost('portal/conf/test.mygo1.com/integrations/0/oracle').reply(204, { value: mockIntegrationData });
  const integrationData = await portalService(http).saveIntegrationConfiguration('test.mygo1.com', 'oracle', mockIntegrationData);
  expect(integrationData.data.value).toStrictEqual(mockIntegrationData);
});
