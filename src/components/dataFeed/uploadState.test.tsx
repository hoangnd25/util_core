import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import DataFeedUploadState, { dataFeedService } from './uploadState';

const scrollToTopFn = jest.fn();
const fakeOnCancel = jest.fn();
const fakeMappingFields = [{
  label: 'mail',
  mappedField: '',
  name: 'mail',
  options: [],
  published: true,
  required: true,
  type: 'string',
  weight: "74",
}, {
  label: 'first name',
  mappedField: '',
  name: 'first_name',
  options: [],
  published: true,
  required: true,
  type: 'string',
}, {
  label: 'last name',
  mappedField: '',
  name: 'last_name',
  options: [],
  published: true,
  required: true,
  type: 'string',
}, {
  label: 'status',
  mappedField: '',
  name: 'status',
  options: [0, 1, 2],
  published: true,
  required: false,
  type: 'integer',
}, {
  label: 'ECK Field',
  mappedField: '',
  name: 'eck',
  options: [0, 1, 2],
  published: true,
  required: true,
  type: 'integer',
  weight: "74",
}];

jest.mock("react-dropzone", () => ({
  default: (props: any) =>
    props.children({
      open: jest.fn(),
      getRootProps: jest.fn(() => ({})),
      getInputProps: jest.fn(() => ({})),
    }),
}));

const mockComponent = () => <div />;
jest.mock("@go1d/go1d/build/components/BaseUploader", () => ({
  default: (props: any) =>
    props.children
      ? props.children({
        getRootProps: () => ({}),
        isDragActive: false,
        open: false,
      })
      : mockComponent,
}));

const setup = (props = {}) => {
  const currentSession = {
    portal: {
      id: 123,
      configuration: {
        integrations: {},
      },
    },
  };
  return mount(
    <IntlProvider locale="en">
      <DataFeedUploadState
        scrollToTop={scrollToTopFn}
        onCancel={fakeOnCancel}
        currentSession={currentSession}
        intl={jest.fn()}
        {...props} />
    </IntlProvider>
  );
};

it('renders without crashing', () => {
  spyOn(dataFeedService, 'fetchMappingFields').and.callFake(() => Promise.resolve());
  setup();

  expect(dataFeedService.fetchMappingFields).toHaveBeenCalledWith(123);
});

it('Should init with default step', async () => {
  spyOn(dataFeedService, 'fetchMappingFields').and.callFake(() => Promise.resolve());

  const Element = setup({ defaultStep: 2 });
  const Component = Element.find('DataFeedUploadState') as any;
  expect(Component.state('step')).toEqual(2);
});

it('should return correct mapped fields', async () => {
  spyOn(dataFeedService, 'fetchMappingFields').and.callFake(() => Promise.resolve({
    go1Fields: fakeMappingFields,
    externalId: 'mail',
  }));
  spyOn(dataFeedService, 'createMapping').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'fetchAWSCredentials').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'createAWSCredentials').and.callFake(() => Promise.resolve());

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  const ComponentInstance = Component.instance();

  await ComponentInstance.componentDidMount();
  expect(Component.state('touched')).toBeFalsy();
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');

  const mappedFields = [{
    label: 'mail',
    mappedField: 'Email',
    name: 'mail',
    options: [],
    published: true,
    required: true,
    type: 'string',
    weight: "74",
  }, {
    label: 'first name',
    mappedField: '',
    name: 'first_name',
    options: [],
    published: true,
    required: true,
    type: 'string',
  }, {
    label: 'last name',
    mappedField: '',
    name: 'last_name',
    options: [],
    published: true,
    required: true,
    type: 'string',
  }, {
    label: 'status',
    mappedField: '',
    name: 'status',
    options: [0, 1, 2],
    published: true,
    required: false,
    type: 'integer',
  }, {
    label: 'ECK Field',
    mappedField: '',
    name: 'eck',
    options: [0, 1, 2],
    published: true,
    required: true,
    type: 'integer',
    weight: "74",
  }];
  expect(Component.state('touched')).toBeTruthy();
  expect(Component.state('go1Fields')).toEqual(mappedFields);
  expect(Component.state('externalIdFields')[0].value).toEqual('mail');
  expect(Component.state('externalIdFields')[1].value).toEqual('eck');
  expect(Component.state('externalId')).toEqual('mail');
  expect(ComponentInstance.validate()).toBeFalsy();

  ComponentInstance.onMapField(fakeMappingFields[1], 'Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Name');
  ComponentInstance.onMapField(fakeMappingFields[4], 'Name');

  expect(ComponentInstance.validate()).toBeTruthy();
  expect(ComponentInstance.mapFields()).toEqual({
    eck: 'Name',
    mail: 'Email',
    first_name: 'Name',
    last_name: 'Name',
    status: '',
  });

  expect(ComponentInstance.getMappedFields()).toEqual([{
    value: 'Email',
    label: 'Email',
  }, {
    value: 'Name',
    label: 'Name',
  }]);

  await ComponentInstance.onMapExternalId('eck');
  await ComponentInstance.onMappingDone();
  const mappingPayload = {
    type: 'account',
    external_id: 'eck',
    mappings: {
      eck: 'Name',
      mail: 'Email',
      first_name: 'Name',
      last_name: 'Name',
      status: '',
    },
    rows: [],
  }
  expect(dataFeedService.createMapping).toHaveBeenCalledWith(mappingPayload, 123);
  expect(dataFeedService.createAWSCredentials).toHaveBeenCalledWith(123);
});

it('should not update existing connection', async () => {
  spyOn(dataFeedService, 'createMapping').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'createAWSCredentials').and.callFake(() => Promise.resolve());

  const Element = setup({
    awsCredential: {
      isNew: false,
      awsCreatedDate: '2019-10-30T05:50:06+00:00',
      awsBucketUrl: 's3://cd22d769e7d5.credential.name',
      awsAccessKeyId: 'cd22d769e7d5',
    }
  });
  const Component = Element.find('DataFeedUploadState') as any;
  Component.setState({ go1Fields: fakeMappingFields });

  const ComponentInstance = Component.instance();
  await ComponentInstance.onMappingDone();
  expect(dataFeedService.createAWSCredentials).not.toHaveBeenCalled();
});

it('should update connection with param &fix', async () => {
  spyOn(dataFeedService, 'createMapping').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'createAWSCredentials').and.callFake(() => Promise.resolve());

  const Element = setup({
    awsCredential: {
      isNew: false,
      awsCreatedDate: '2019-10-30T05:50:06+00:00',
      awsBucketUrl: 's3://cd22d769e7d5.credential.name',
      awsAccessKeyId: 'cd22d769e7d5',
      awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
    }
  });
  const Component = Element.find('DataFeedUploadState') as any;
  Component.setState({ go1Fields: fakeMappingFields });

  const ComponentInstance = Component.instance();
  ComponentInstance.onMapField(fakeMappingFields[1], 'Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Name');
  ComponentInstance.onMapField(fakeMappingFields[4], 'Name');

  await ComponentInstance.onMapExternalId('eck');
  await ComponentInstance.onMappingDone();
  expect(dataFeedService.createAWSCredentials).toHaveBeenCalledWith(123, true);
});

it('should scroll to top when request is failed', async () => {
  spyOn(dataFeedService, 'createMapping').and.callFake(() => Promise.reject({}));

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  Component.setState({ go1Fields: fakeMappingFields });

  const ComponentInstance = Component.instance();
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');
  ComponentInstance.onMapField(fakeMappingFields[1], 'First Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Last Name');

  await ComponentInstance.onMappingDone();
  expect(scrollToTopFn).toHaveBeenCalled();
});
