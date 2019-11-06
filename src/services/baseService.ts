import Cookies from 'universal-cookie';
import { HttpInstance } from '@src/utils/http';
import extractGo1Metadata from '@src/utils/helper';

/* istanbul ignore file  */
class BaseService {
  public http: HttpInstance = null ;

  constructor(http: HttpInstance, go1CookieValue?: Cookies) {
    this.http = http;
    if (__DEV__ && process.env.LOCAL_JWT) {
      // For local support .env JWT, will pick the first account returned by the server
      this.http.setJWT(process.env.LOCAL_JWT);
    } else {
      const { jwt } = extractGo1Metadata(go1CookieValue);
      this.http.setJWT(jwt);
    }
    return this;
  }
}

export default BaseService;
