import MockAdapter from 'axios-mock-adapter';
import createHttpInstance from '@src/utils/http';
import scormService from '.';

let mock: MockAdapter;
const http = createHttpInstance();

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

test('should fetch Application ID', async () => {
  mock.onPost('/scorm/status', { portal: 'test.mygo1.com' }).reply(200, { client_id: 'Existing Application ID' });

  const service = scormService(http);
  const actual = await service.getApplicationId('test.mygo1.com');

  expect(actual).toEqual('Existing Application ID');
});

test('should generate new Application ID', async () => {
  mock.onPost('/scorm/generate', { portal: 'test.mygo1.com' }).reply(200, { client_id: 'New Application ID' });

  const service = scormService(http);
  const actual = await service.createApplicationId('test.mygo1.com');

  expect(actual).toEqual('New Application ID');
});

test('should remove Application ID', async () => {
  mock.onPost('/scorm/remove', { portal: 'test.mygo1.com' }).reply(200, { client_id: 'Empty Application ID' });

  const service = scormService(http);
  const actual = await service.removeApplicationId('test.mygo1.com');

  expect(actual).toEqual('Empty Application ID');
});
