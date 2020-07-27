import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from '@src/services/baseService';

const defaultHttp = createHttp();

class DataFeedService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async getApplicationId(portalName: string) {
    let clientId = null;

    try {
      const { data } = await this.http.post(`/scorm/status`, { portal: portalName });

      if (data && data.client_id) {
        clientId = data.client_id;
      }
    } catch(e) {};

    return clientId;
  }

  async createApplicationId(portalName: string) {
    let clientId = null;

    try {
      const { data } = await this.http.post(`/scorm/generate`, { portal: portalName });

      if (data && data.client_id) {
        clientId = data.client_id;
      }
    } catch(e) {};

    return clientId;
  }

  async removeApplicationId(portalName: string) {
    let clientId = null;

    try {
      const { data } = await this.http.post(`/scorm/remove`, { portal: portalName });

      if (data && data.client_id) {
        clientId = data.client_id;
      }
    } catch(e) {};

    return clientId;
  };
}

export default function(http?: HttpInstance) {
  return new DataFeedService(http);
}
