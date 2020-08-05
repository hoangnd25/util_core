import Enzyme, { mount, shallow } from 'enzyme';
import * as React from 'react';
import ContentDistributorExport, { contentDistributorService } from '.';

const portalMock = {
  id: '123',
  title: 'test.mygo1.com',
  data: {},
  featureToggles: [],
  files: {},
  configuration: {
    integrations: {
      oracle: {
        domain: 'test domain',
        username: 'testusername',
        password: 'testpassword',
      }
    },
  },
};

const mockCustomCollectionResponse = {
  default_collection: {
    id: '1583',
    type: 'default',
    machine_name: 'default',
    title: 'default',
    status: '1',
    portal_id: '8259249',
    author_id: '1459371',
    data: 'null',
    timestamp: '1586311405',
    created: '1586311405',
    updated: '1586311405',
  },
  paid: 2833,
  subscribe: 0,
  custom: 2,
  share: 0,
  custom_share: 0,
  free: 15654,
};

const mockExportData = { portalId: '123', type: 'oracle' };
const exportStatusMock = {
  timestamp: 1586391483247,
  status: 'queued',
};

beforeEach(() => {
  spyOn(contentDistributorService, 'getCustomContent').and.callFake(() =>
    Promise.resolve(mockCustomCollectionResponse)
  );
  spyOn(contentDistributorService, 'exportContent').and.callFake(() => Promise.resolve(mockExportData));
  spyOn(contentDistributorService, 'getExportStatus').and.callFake(() => Promise.resolve(exportStatusMock));
});

const setup = (isConnected, targetName) => {
  return mount(
    <ContentDistributorExport isConnected={isConnected} exportType={targetName} portal={portalMock} />
  );
};

it('Should render export for oracle', () => {
  setup(true, 'oracle');
});

it('Should render export for oracle not connected', () => {
  setup(false, 'oracle');
});