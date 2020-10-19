/* istanbul ignore file  */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';
import config from '@src/config';
import JwtRefresh from './jwtRefresh';

const log = {
  error: debug('go:http:error'),
  request: debug('go:http:request'),
  response: debug('go:http:response'),
};

export type HttpInstance = AxiosInstance & {
  setJWT: (jwt: string) => void;
  clearJWT: () => void;
};

export default function create(opts: any = {}): HttpInstance {
  const http = axios.create({
    baseURL: config.apiEndpoint,
    headers: {},
    ...opts,
  }) as HttpInstance;

  // JWT Helpers
  http.setJWT = (jwt: string): void => {
    http.defaults.headers.Authorization = `Bearer ${jwt}`;
  };

  http.clearJWT = (): void => {
    http.defaults.headers.Authorization = null;
  };

  const jr = new JwtRefresh(http);

  // Add logging interceptors to axios
  http.interceptors.request.use((reqConfig: AxiosRequestConfig) => {
    console.log(reqConfig.url); //debugging
    log.request(
      `${reqConfig.method && reqConfig.method.toUpperCase()} ${reqConfig.url}`,
      reqConfig.params,
      reqConfig.data
    );

    // don't need execute it now, run on next event loop
    setTimeout(() => jr.onRequest(reqConfig), 0);

    return reqConfig;
  });

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      log.response(
        `${response.status} ${response.config.method && response.config.method.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
      return response;
    },
    (error: AxiosError) => {
      if (error.config) {
        log.error(
          `${error.response && error.response.status} ${error.config.method &&
          error.config.method.toUpperCase()} ${error.config.url}`
        );
      } else {
        log.error(`${error.name}: ${error.message}`);
      }
      throw error;
    }
  );

  return http;
}
