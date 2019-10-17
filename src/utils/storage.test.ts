import { getLocal, getSession, getStorage, setLocal, setSession, setStorage } from './storage';

it('sets local from string', () => {
  setLocal('test', 'test');

  expect(getLocal('test')).toBe('test');
});

it('sets local from number', () => {
  setLocal('test', 12345);

  expect(getLocal('test')).toBe(12345);
});

it('get local value as number', () => {
  setLocal('test', 12345);

  const localValue = getLocal('test');

  expect(localValue).toBe(12345);
});

it('get local value as string', () => {
  setLocal('test', 'test');

  const localValue = getLocal('test');

  expect(localValue).toBe('test');
});

it('sets session from string', () => {
  setSession('test', 'test');

  expect(getSession('test')).toBe('test');
});

it('sets session from number', () => {
  setSession('test', 12345);

  expect(getSession('test')).toBe(12345);
});

it('get session value as number', () => {
  setSession('test', 12345);

  const localValue = getSession('test');

  expect(localValue).toBe(12345);
});

it('get session value as string', () => {
  setSession('test', 'test');

  const localValue = getSession('test');

  expect(localValue).toBe('test');
});

it('sets storage from string', () => {
  setStorage('test', 'test', true);

  expect(getStorage('test')).toBe('test');
});

it('sets storage from number', () => {
  setStorage('test', 12345, true);

  expect(getStorage('test')).toBe(12345);
});

it('get storage value as number', () => {
  setStorage('test', 12345);

  const localValue = getStorage('test');

  expect(localValue).toBe(12345);
});

it('get storage value as string', () => {
  setStorage('test', 'test');

  const localValue = getStorage('test');

  expect(localValue).toBe('test');
});
