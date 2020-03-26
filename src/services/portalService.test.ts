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
