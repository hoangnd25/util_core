import MockAdapter from 'axios-mock-adapter';
import create from '../utils/http';
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

  const service = FeatureToggleService(http);
  const data = await service.getFeatures('uuid:instanceId:test.mygo1.com:jwt');

  expect(data).toEqual(fakeToggles);
});
