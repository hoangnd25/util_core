import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from '@src/services/baseService';

const defaultHttp = createHttp();

class ContentDistributorService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async getCustomContent(portalId: number): Promise<any> {
    const url = `collection-service/portal/${portalId}/collections/default/stats`
    const { data } = await this.http.get(url);
    return data;
  }

  async getExportStatus(portalId: number): Promise<any> {
    const url = `content-distributor/status/${portalId}`
    return this.http.get(url).then(response => response.status === 200 ? response.data : null);
  }

  async exportContent(portalId: number, integrationName: string): Promise<any> {
    const url = `content-distributor/export`
    return this.http.post(url, { portalId, type: integrationName }).then(response => response.status === 200 ? response.data : null);
  }
}

export default function (http?: HttpInstance) {
  return new ContentDistributorService(http);
}
