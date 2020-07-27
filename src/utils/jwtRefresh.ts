import * as JWT from 'jsonwebtoken';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setStorage } from '@src/utils/storage';

type storageHandler = (key: string, value: any, persist: boolean) => void;

export default class JwtRefresh {
  // HTTP client to make HTTP request
  private http: AxiosInstance;

  // A simple flag to help us keep single running process.
  private processing: boolean = false;

  private scheduledProcessingInSeconds: number = 0;

  // Endpoint to refresh the JWT.
  private queryPath: string = '/access/v1.0/session/translateToken';

  private setStorage: storageHandler;

  constructor(http: AxiosInstance, storageHandler?: storageHandler) {
    this.http = http;
    this.setStorage = (typeof storageHandler === 'undefined') ? setStorage : storageHandler;
  }

  private tokenIsExpiredIn(token: string): number {
    const payload = JWT.decode(token);

    if (payload && typeof payload.exp !== 'undefined') {
      return payload.exp - Math.round(((new Date).getTime()) / 1000);
    }

    return -1;
  }

  private async refreshExpiringToken(queryPath: string, token: string): Promise<void> {
    const payload = JWT.decode(token);

    if (payload === null) {
      return;
    }

    const sessionToken = payload.sid;

    if (
      this.processing ||                          // another process is running
      queryPath.indexOf(this.queryPath) !== -1 || // don't need check self-requests.
      typeof sessionToken === 'undefined'         // previous version of JWT does not include session information.
    ) {
      return;
    }

    try {
      this.processing = true;
      const res = await this.http.get(this.queryPath, { headers: { Authorization: `Bearer ${sessionToken}` } });

      this.setStorage('jwt', res.data.jwt, true);
    } finally {
      this.processing = false;
    }
  }

  public async onRequest(config: AxiosRequestConfig) {
    if (typeof config.headers !== 'undefined') {
      if (typeof config.headers.Authorization === 'string') {
        const token = config.headers.Authorization.split(' ').pop();

        if (token !== '') {
          const remainingTime = this.tokenIsExpiredIn(token);

          if (remainingTime <= 0) {
            // expired
          }

          const oneDayInSecond = 24 * 60 * 60;
          if (remainingTime <= oneDayInSecond) {
            // JWT is about expired in 24 hours, refresh it now.
            this.refreshExpiringToken(config.url, token);
          }
        }
      }
    }
  }
}
