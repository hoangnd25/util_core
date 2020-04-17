import MockAdapter from 'axios-mock-adapter';
import create from '@src/utils/http';
import contentDistributorService from './contentDistributorService';

let mock: MockAdapter;
const http = create();

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

test('should return customContentSelection for portal', async () => {
  const mockCustomCollectionResponse = {
    "default_collection": {
      "id": "1583",
      "type": "default",
      "machine_name": "default",
      "title": "default",
      "status": "1",
      "portal_id": "8259249",
      "author_id": "1459371",
      "data": "null",
      "timestamp": "1586311405",
      "created": "1586311405",
      "updated": "1586311405"
    },
    "paid": 2833,
    "subscribe": 0,
    "custom": 2,
    "share": 0,
    "custom_share": 0,
    "free": 15654
  }
  mock.onGet(`collection-service/portal/123/collections/default/stats`).reply(200, mockCustomCollectionResponse);
  const customCollection = await contentDistributorService(http).getCustomContent(123);
  expect(customCollection).toStrictEqual(mockCustomCollectionResponse);
});

test('should return export status', async () => {
  const exportStatusMock = {
    "timestamp": 1586391483247,
    "status": "queued"
  }
  mock.onGet('content-distributor/status/123').reply(200, exportStatusMock);
  const exportStatus = await contentDistributorService(http).getExportStatus(123);
  expect(exportStatus).toStrictEqual(exportStatusMock);
});

test('should export Custom Collection content', async () => {
  const mockExportData = { portalId: "123", type: "oracle" }
  mock.onPost('content-distributor/export').reply(200, mockExportData);
  const exportData = await contentDistributorService(http).exportContent(123, 'oracle');
  expect(exportData).toStrictEqual(mockExportData);
});
