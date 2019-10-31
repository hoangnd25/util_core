import getConfig from 'next/config';

let config: any;

// module is considered a microapp e.g. prospector, 1-player. So in case we will need to merge two microapps into one, this setup will allow us to do it with less effort.
// if you have more than one module here, please specify the name and path in the list below
// This list is also used for the link component to check if it is an internal or external link
export const modulesInApp = {
  "base-app-demo": { baseURL: "/r/app/base-app-demo" }
};

export const availableModules = Object.keys(modulesInApp);

// if only one module in this app, moduleName is optional
export const getBaseUrl = (moduleName=null) => {
  // if moduleName provided, default to first one if not
  return (moduleName && modulesInApp[moduleName]) ? modulesInApp[moduleName].baseURL : modulesInApp[availableModules[0]].baseURL;
};

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
    return ['API_URL', 'BASE_PATH', 'LOCAL_JWT', 'ENV'];
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
    return getConfigValue('API_URL');
  },
  get isClientSide() {
    return typeof window !== 'undefined' && window.document && typeof window.document.createElement === 'function';
  },
  get localJWT() {
    // eslint-disable-next-line
    return __DEV__ && getConfigValue('LOCAL_JWT');
  },
};
