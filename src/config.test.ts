import config, {getConfigValue} from './config';

it('test get appEnv', () => {
  expect(config.appEnv).toBe('test');
});

it('test get apiEndpoint', () => {
  expect(config.apiEndpoint).toBe('https://api-dev.go1.co');
});

it('test get isClientSide', () => {
  expect(config.isClientSide).toBe(true);
});

it('test get port', () => {
  expect(config.port).toBe(80);
});

it('host', () => {
  expect(config.host).toBe('localhost:80');
});

it('localJWT', () => {
  expect(config.localJWT).toBe(false);
});

it('exportKeys', () => {
  expect(config.exportKeys).toContain('API_URL');
  expect(config.exportKeys).toContain('BASE_PATH');
  expect(config.exportKeys).toContain('LOCAL_JWT');
  expect(config.exportKeys).toContain('ENV');
});

it('basePath', () => {
  console.error = jest.fn();
  expect(config.basePath).toBeDefined()
});

it('handles not defined variables', () => {
  const errorMock = jest.fn();
  console.error = errorMock;
  expect(getConfigValue('some_key')).toBe("");
  expect(errorMock.mock.calls.length).toBe(1);
  expect(getConfigValue('some_key','default')).toBe('default');
});
