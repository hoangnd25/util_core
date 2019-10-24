import { getStorage } from '../utils/storage';
import { HttpInstance } from '../utils/http';

class FeatureToggleService {
  public http: HttpInstance = null;

  constructor(http: HttpInstance) {
    this.http = http;
    return this;
  }

  public async getFeatures(go1CookieValue?: string) {
    let portal = '';

    // try to get from cookie
    if (go1CookieValue) {
      const [uuid, instanceId, portalName, jwt] = go1CookieValue.split(':');
      portal = portalName;
    }
    // Fallback to localStorage if Cookie doesn't exist
    else {
      portal = getStorage('active-instance-domain');
    }

    const url = `/featuretoggle/feature${portal ? `?context[portal][]=${portal}` : ""}`;
    const { data } = await this.http.get(url);
    return data;
  }
}

export default function(http: HttpInstance) {
  return new FeatureToggleService(http);
}
