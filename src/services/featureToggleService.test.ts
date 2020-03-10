import MockAdapter from 'axios-mock-adapter';
import create from '@src/utils/http';
import FeatureToggleService from './featureToggleService';

let mock: MockAdapter;
const http = create();

beforeEach(() => {
  mock = new MockAdapter(http);
});

afterEach(() => {
  mock.reset();
});

test('should get correct feature toggle data', async () => {
  const fakeToggles = { xero: true, insights: false };
  mock.onGet('/featuretoggle/feature?context[portal][]=test.mygo1.com').reply(200, fakeToggles);
  mock.onGet('/atlantis/features').reply(200, {});

  const service = FeatureToggleService(http);
  const data = await service.getFeatures('test.mygo1.com');

  expect(data).toEqual({ ...fakeToggles, "content-selector": false });
});
