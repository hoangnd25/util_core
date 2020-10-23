import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from "@src/services/baseService";
import { getConfigValue } from "@src/config";
import { CurrentSessionType } from "@src/types/user";

const defaultHttp = createHttp({baseURL: getConfigValue("AUTH_URL","https://auth.go1.com")});

class AuthService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  async exchangeAuthToken(currentSession: CurrentSessionType): Promise<any> {
    try {
      const { status, data } = await this.http.post(`/oauth/token`, {
        client_id: getConfigValue("AUTH_CLIENT_ID"),
        grant_type: "go1_jwt",
        jwt: currentSession.jwt,
        portal_name: currentSession.portal.title,
        scope: "app.read app.write",
      });
      if(status === 200) {
        this.http.setJWT(data.access_token);
        return data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  async loadClients(options?: { limit?: number, offset?: number, portal_name: string }): Promise<any> {
    try {
      const { status, data } = await this.http.get(`/client`, {
        params: {
          limit: 50,
          offset: 0,
          ...options
        }
      });
      if(status === 200) {
        return data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  async createClients({clientName, portalName, redirectUrl}): Promise<any> {
    try {
      const { status, data } = await this.http.post(`/client`, {
        client_name: clientName,
        portal_name: portalName,
        redirect_uri: redirectUrl
      });
      if(status === 200) {
        return data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}

export default function () {
  return new AuthService();
}
