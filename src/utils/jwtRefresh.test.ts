import * as JWT from 'jsonwebtoken';
import createHttp from './http';
import { currentSessionMock } from '../components/common/WithAuth/mocks/authMocks';
import JwtRefresh from './jwtRefresh';

describe('JWT refresh', function () {
  const twentyHourInSecond = 20 * 60 * 60;

  it('Session found > JWT is expired in next 5 minutes: Triggered', async (done) => {
    const payload = JWT.decode(currentSessionMock.jwt);
    payload.exp = twentyHourInSecond + Math.round((new Date).getTime() / 1000);
    payload.sid = '2301:23eda5c4-f8ab-4441-a912-19e2a5ea0108:tsCHegTymJwKvYfYZq2XCeYdcdY=';

    const jwt = JWT.sign(payload, 'QA');
    const http = createHttp();
    const storageHandler = jest.fn();
    const jr = new JwtRefresh(http, storageHandler);

    await jr.onRequest({ url: '/something', headers: { Authorization: `Bearer ${jwt}` } });
    setImmediate(() => {
      expect(storageHandler).not.toHaveBeenCalled();
      expect(Reflect.get(jr, 'scheduledProcessingInSeconds')).toEqual(0);

      done();
    });
  });

  it('No session token provided: Not triggered', async (done) => {
    const http = createHttp();
    const storageHandler = jest.fn();
    const jr = new JwtRefresh(http, storageHandler);
    const config = { url: '/something' };
    await jr.onRequest(config);

    setImmediate(() => {
      expect(storageHandler).not.toHaveBeenCalled();
      done();
    });
  });

  it('Session token not found: Not triggered', async (done) => {
    const payload = JWT.decode(currentSessionMock.jwt);
    payload.exp = 300 + Math.round((new Date).getTime() / 1000);

    const jwt = JWT.sign(payload, 'QA');
    const http = createHttp();
    const storageHandler = jest.fn();
    const jr = new JwtRefresh(http, storageHandler);

    await jr.onRequest({ url: '/something', headers: { Authorization: `Bearer ${jwt}` } });
    setImmediate(() => {
      expect(storageHandler).not.toHaveBeenCalled();
      expect(Reflect.get(jr, 'scheduledProcessingInSeconds')).toEqual(0);

      done();
    });
  });
});
