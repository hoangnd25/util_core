import { HttpInstance } from '../utils/http';

class FeatureToggleService {
  public http: HttpInstance = null;

  constructor(http: HttpInstance) {
    this.http = http;
    return this;
  }

  public async getFeatures(portal?: string) {
    if (portal) {
      const url = `/featuretoggle/feature${portal ? `?context[portal][]=${portal}` : ''}`;
      const { data } = await this.http.get(url);
      return data;
    }

    return {};
  }
}

export default function(http: HttpInstance) {
  return new FeatureToggleService(http);
}
