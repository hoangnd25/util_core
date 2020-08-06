import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from '@src/services/baseService';

const defaultHttp = createHttp();

export interface SSOConnectionDetails {
  id: string
  name: string
  identifier: string
  strategy: string
  provider: string
  links: {
    authorize: string
  }
}

class MicrosoftAzureService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  public async getConnection(portalDomain: string): Promise<SSOConnectionDetails | null> {
    try {
      const { data } = await this.http.get(`sso/public/connections/${ portalDomain }`);
      const azureConnection: SSOConnectionDetails = data.find(ssoConnection => ssoConnection.provider === 'azure');
      return azureConnection;
    } catch (err) {
      return null;
    }
  }

  public async getRedirectLink(portalDomain: string): Promise<(string)> {
    try {
      const { data } = await this.http.get(`sso/oauth/azure/portal/authorize?portal=${ portalDomain }`);
      return data.redirectUrl;
    } catch (err) {
      return null;
    }
  }
}

export default function (http?: HttpInstance) {
  return new MicrosoftAzureService(http);
}