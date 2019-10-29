import getConfig from 'next/config';

let config: any;

export function getConfigValue(key: string, defaultValue?: string) : string {
  if (!config) {
    config = getConfig().publicRuntimeConfig;
  }
  if (key in config) {
    return config[key];
  }
  if (!defaultValue) {
    // eslint-disable-next-line
    console.error(`Configuration Error: required environment variable '${key}' not found.`);
  }
  return defaultValue || "";
}

export default {
  get exportKeys() {
    return ['API_ENDPOINT', 'BASE_PATH', 'LOCAL_JWT', 'ENV'];
  },
  get appEnv() {
    return getConfigValue('ENV');
  },
  get basePath() {
    return getConfigValue('BASE_PATH');
  },
  get port() {
    return getConfigValue('PORT');
  },
  get host() {
    return `localhost:${getConfigValue('PORT')}`;
  },
  get apiEndpoint() {
    return getConfigValue('API_ENDPOINT');
  },
  get isClientSide() {
    return typeof window !== 'undefined' && window.document && typeof window.document.createElement === 'function';
  },
  get localJWT() {
    // eslint-disable-next-line
    return __DEV__ && getConfigValue('LOCAL_JWT');
  },
};
