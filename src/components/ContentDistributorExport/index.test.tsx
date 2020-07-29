import Enzyme, { mount, shallow } from 'enzyme';
import * as React from 'react';
import ContentDistributorExport, { contentDistributorService, portalService } from '.';

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
      },
    },
  },
};

const setup = (targetName) => {
  return mount(
    <ContentDistributorExport targetName={targetName} portal={portalMock} />
  );
};

it('Should render distributor for oracle', () => {
    setup('oracle');
});

it('Should render custom content total for oracle', async (done) => {
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
  const mockIntegrationConfiguration = {
    status: true
  };
  spyOn(portalService, 'fetchIntegrationConfiguration').and.callFake(() =>
    Promise.resolve(mockIntegrationConfiguration)
  );
  spyOn(contentDistributorService, 'getCustomContent').and.callFake(() =>
    Promise.resolve(mockCustomCollectionResponse)
  );
  const wrapper = setup('oracle');
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.state('isLoading')).toBeFalsy();
    expect(wrapper.state('customContentCollection')).toEqual(mockCustomCollectionResponse);
    done();
  });
});

it('Should export content for oracle', async (done) => {
  const mockExportData = { portalId: '123', type: 'oracle' };
  const exportStatusMock = {
    timestamp: 1586391483247,
    status: 'queued',
  };
  spyOn(contentDistributorService, 'exportContent').and.callFake(() => Promise.resolve(mockExportData));
  spyOn(contentDistributorService, 'getExportStatus').and.callFake(() => Promise.resolve(exportStatusMock));

  const wrapper = setup('oracle');
  setImmediate(async () => {
    wrapper.update();
    await (wrapper.instance() as any).contentDistributorExport();
    await (wrapper.instance() as any).getContentDistributorStatus();
    expect(contentDistributorService.exportContent).toHaveBeenCalled();
    expect(wrapper.state('exportStatus')).toEqual(exportStatusMock);
    done();
  });
});