
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserService from './userService';

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});


test('should get user with portal & uuid', async () => {
  const raw = {
    id: 1,
  };

  mock.onGet('/user/account/current/MY_UUID/MY_PORTAL?allPortals=false').reply(200, raw);

  const service = UserService(axios);

  const data = await service.getCurrentAccount({
    uuid: 'MY_UUID',
    portal: 'MY_PORTAL',
  });

  expect(data).toEqual({ id: 1 });
});
