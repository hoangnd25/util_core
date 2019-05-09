import dotenv from 'dotenv';

let config: any;

export function setupConfigSource() {
  if (typeof window === 'undefined') {
    dotenv.config({ path: '.env', silent: true });
    config = process.env;
  } else {
    config = window.APP_CONFIG;
  }
}

function getConfigValue(key) {
  if (!config) {
    setupConfigSource();
  }
  if (key in config) {
    return config[key];
  }
  throw new Error(`Configuration Error: required environment variable '${key}' not found.`);
}

export default {
  basePath: '/',
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
  get exportKeys() {
    return ['API_ENDPOINT'];
  },
  get isClientSide() {
    return typeof window !== 'undefined' && window.document && typeof window.document.createElement === 'function';
  },
};
