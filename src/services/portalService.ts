import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from "./baseService";

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

}

export default function(http?: HttpInstance) {
  return new PortalService(http);
}
