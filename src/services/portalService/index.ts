import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from "@src/services/baseService";

const defaultHttp = createHttp();

class PortalService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async fetchIntegrationConfiguration(portalName: string, integrationName: string): Promise<any> {
    const url = `portal/conf/${portalName}/integrations/${integrationName}`;
    try {
      const { status, data: { data } } = await this.http.get(url);
      return status === 200 ? data : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async saveIntegrationConfiguration(portalName: string, integrationName: string, integrationSettings: any): Promise<any> {
    const url = `portal/conf/${portalName}/integrations/0/${integrationName}`;
    return this.http.post(url, { value: integrationSettings })
      .then(response => response.status === 204 ? response : null)
      .catch(() => null)
  }

  async save<T = any>(portal: string, payload: T) {
    const { data } = await this.http.post<{status: 'OK'}>(`/portal/${portal}`, payload);
    return data;
  }

  async applyChildPortalCustomization(portal: string, groups: string[]) {
    const { data } = await this.http.post<{status: 'OK'}>(`/portal/${portal}/inheritance`, { groups });
    return data;
  }
}

export default function createPortalService (http?: HttpInstance) {
  return new PortalService(http);
}
