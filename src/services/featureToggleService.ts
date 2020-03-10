import { HttpInstance } from '@src/utils/http';

class FeatureToggleService {
  public http: HttpInstance = null;

  constructor(http: HttpInstance) {
    this.http = http;
    return this;
  }

  public async getFeatures(portal?: string) {
    if (portal) {
      const featureToggles = {};
      const { data: portalFeatures } = await this.http.get(`featuretoggle/feature?context[portal][]=${portal}`);
      const { data: houstonFeatures } = await this.http.get('atlantis/features');
      const contentSelector = houstonFeatures['content-selector'];

      return {
        ...featureToggles,
        ...portalFeatures,
        "content-selector": !!(contentSelector && contentSelector.enabled),
      };
    }

    return {};
  }
}

export default function(http: HttpInstance) {
  return new FeatureToggleService(http);
}
