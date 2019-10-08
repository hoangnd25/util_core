import getConfig from 'next/config';

let config: any;

export function setupConfigSource() {
  if (typeof window === 'undefined') {
    config = process.env;
  } else {
    config = getConfig().publicRuntimeConfig;
  }
}

export function getConfigValue(key: string, defaultValue?: string) : string {
  if (!config) {
    setupConfigSource();
  }
  if (key in config) {
    return config[key];
  }
  if (!defaultValue) {
    console.error(`Configuration Error: required environment variable '${key}' not found.`);
  }
  return defaultValue ? defaultValue : "";
}

export default {
  get exportKeys() {
    return ['API_ENDPOINT', 'BASE_PATH', 'LOCAL_JWT', 'APP_ENV'];
  },
  get appEnv() {
    return getConfigValue('APP_ENV');
  },
  get basePath() {
    return getConfigValue('BASE_PATH');
  },
  get port() {
    return getConfigValue('PORT');
  },
  get enableHttps() {
    return getConfigValue('ENABLE_HTTPS');
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
    return __DEV__ && getConfigValue('LOCAL_JWT');
  },
};
