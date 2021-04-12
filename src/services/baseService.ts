import Cookies from 'universal-cookie';
import { HttpInstance } from '@src/utils/http';
import { getNested } from '@go1d/mine/utils';
import { getStorage } from '@src/utils/storage';

const defaultCookies = new Cookies();

/* istanbul ignore file  */
class BaseService {
  public http: HttpInstance = null ;

  constructor(http: HttpInstance, go1CookieValue?: Cookies) {
    this.http = http;
    if (__DEV__ && process.env.LOCAL_JWT) {
      // For local support .env JWT, will pick the first account returned by the server
      this.http.setJWT(process.env.LOCAL_JWT);
    } else {
      const { jwt } = this.extractGo1Metadata(go1CookieValue);
      this.http.setJWT(jwt);
    }
    return this;
  }

  private extractGo1Metadata(cookies: Cookies = defaultCookies) {
    const go1Cookies = getNested(cookies, 'cookies.go1', null);
  
    // Try to get from Cookie
    if (go1Cookies) {
      const [uuid, instanceId, portalName, jwt] = go1Cookies.split(':');
      return {
        jwt,
        uuid,
        instanceId, // deprecated, should use `portalId` instead
        portalId: instanceId,
        portalName,
      }
    }
  
    // Fallback to localStorage if Cookie doesn't exist
    if (typeof window !== 'undefined') {
      const jwt = getStorage('jwt');
      const uuid = getStorage('uuid');
      const instanceId = getStorage('active-instance');
      const portalName = getStorage('active-instance-domain');
  
      return {
        jwt,
        uuid,
        instanceId,
        portalId: instanceId,
        portalName,
      }
    }
  
    return {
      jwt: undefined,
      uuid: undefined,
      instanceId: undefined,
      portalId: undefined,
      portalName: undefined,
    }
  }
}

export default BaseService;