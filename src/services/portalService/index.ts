import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from "@src/services/baseService";

const defaultHttp = createHttp();

class PortalService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async fetchCustomConfiguration(portalName: string, configName: string): Promise<any> {
    const url = `portal/conf/${portalName}/GO1/${configName}`;
    const { data: { data } } = await this.http.get(url);
    return data;
  }

  async fetchIntegrationConfiguration(portalName: string, integrationName: string): Promise<any> {
    const url = `portal/conf/${portalName}/integrations/${integrationName}`;
    return await this.http.get(url).then(response => response.status === 200 ? response.data.data : []);
  }

  async saveIntegrationConfiguration(portalName: string, integrationName: string, integrationSettings: any): Promise<any> {
    const url = `portal/conf/${portalName}/integrations/0/${integrationName}`;
    return await this.http.post(url, { value: integrationSettings }).then(response => response.status === 204 ? response : null);
  }

}

export default function (http?: HttpInstance) {
  return new PortalService(http);
}
