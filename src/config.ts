import dotenv from 'dotenv';

let config: any;

export function setupConfigSource() {
  if (typeof window === 'undefined') {
    dotenv.config({ path: '.env', silent: true } as any);
    config = process.env;
  } else {
    config = window.APP_CONFIG;
  }
}

export function getConfigValue(key: string) {
  if (!config) {
    setupConfigSource();
  }
  if (key in config) {
    return config[key];
  }
  console.error(`Configuration Error: required environment variable '${key}' not found.`);
}

export default {
  get exportKeys() {
    return ['API_ENDPOINT', 'BASE_PATH', 'LOCAL_JWT'];
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
