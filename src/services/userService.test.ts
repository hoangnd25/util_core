import MockAdapter from 'axios-mock-adapter';
import create from '../utils/http';
import UserService from './userService';

let mock: MockAdapter;

const http = create();

beforeEach(() => {
  mock = new MockAdapter(http);
});

afterEach(() => {
  mock.reset();
});

test('should get user data with one time token', async () => {
  const raw = {
    id: 1,
  };

  mock.onGet('/user/account/password/TOKEN?allPortals=false').reply(200, raw);

  const service = UserService(http);

  const data = await service.getCurrentAccountWithOTT('TOKEN');

  expect(data).toEqual({ id: 1 });
});


test('should get user with portal & uuid', async () => {
  const raw = {
    id: 1,
  };

  mock.onGet('/user/account/current/MY_UUID/MY_PORTAL?allPortals=false').reply(200, raw);

  const service = UserService(http);

  const data = await service.getCurrentAccount({
    uuid: 'MY_UUID',
    portal: 'MY_PORTAL',
  });

  expect(data).toEqual({ id: 1 });
});
