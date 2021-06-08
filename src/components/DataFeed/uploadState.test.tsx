import { mount } from 'enzyme';
import * as React from 'react';
import { setupI18n } from '@lingui/core';
import DataFeedUploadState, { dataFeedService } from './uploadState';

const scrollToTopFn = jest.fn();
const fakeOnCancel = jest.fn();
const awsCreds = {
  isNew: false,
  awsCreatedDate: '2019-10-30T05:50:06+00:00',
  awsBucketUrl: 's3://cd22d769e7d5.credential.name',
  awsAccessKeyId: 'cd22d769e7d5',
  awsSecretKey: 'secret',
};
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
  weight: "75",
}, {
  label: 'last name',
  mappedField: '',
  name: 'last_name',
  options: [],
  published: true,
  required: true,
  type: 'string',
  weight: "76",
}, {
  label: 'status',
  mappedField: '',
  name: 'status',
  options: [0, 1, 2],
  published: true,
  required: false,
  type: 'integer',
  weight: "77",
}, {
  label: 'ECK Field',
  mappedField: '',
  name: 'eck',
  options: [0, 1, 2],
  published: true,
  required: true,
  type: 'integer',
  weight: "78",
}];

const i18n = setupI18n({ language: 'en', catalogs: { en: {
  messages: {}
} } });

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
    <DataFeedUploadState
        i18n={i18n}
        scrollToTop={scrollToTopFn}
        onCancel={fakeOnCancel}
        currentSession={currentSession}
        {...props} />
  );
};

it('renders without crashing', (done) => {
  jest.spyOn(dataFeedService, 'fetchMappingFields').mockResolvedValue({
    go1Fields: fakeMappingFields,
    externalId: 'mail',
  });
  setup();

  expect(dataFeedService.fetchMappingFields).toHaveBeenCalledWith(123);
  done();
});

it('Should init with default step', async (done) => {
  jest.spyOn(dataFeedService, 'fetchMappingFields').mockResolvedValue({
    go1Fields: fakeMappingFields,
    externalId: 'mail',
  });

  const Element = setup({ defaultStep: 2 });
  const Component = Element.find('DataFeedUploadState') as any;
  expect(Component.state('step')).toEqual(2);
  done();
});

it('should return correct mapped fields', async (done) => {
  jest.spyOn(dataFeedService, 'fetchMappingFields').mockResolvedValue({
    go1Fields: fakeMappingFields,
    externalId: 'mail',
  });
  jest.spyOn(dataFeedService, 'createMapping').mockResolvedValue(awsCreds);
  jest.spyOn(dataFeedService, 'fetchAWSCredentials').mockResolvedValue(awsCreds);
  jest.spyOn(dataFeedService, 'createAWSCredentials').mockResolvedValue(awsCreds);

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  const ComponentInstance = Component.instance();

  await ComponentInstance.componentDidMount();
  expect(Component.state('touched')).toBeFalsy();
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');

  expect(Component.state('touched')).toBeTruthy();
  expect(Component.state('go1Fields')).toEqual(fakeMappingFields);
  expect(Component.state('externalIdFields')[0].value).toEqual('mail');
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
  done();
});

it('should not update existing connection', async (done) => {
  jest.spyOn(dataFeedService, 'createMapping').mockResolvedValue(awsCreds);
  jest.spyOn(dataFeedService, 'createAWSCredentials').mockResolvedValue(awsCreds);

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
  done();
});

it('should update connection with param &fix', async (done) => {
  jest.spyOn(dataFeedService, 'createMapping').mockResolvedValue(awsCreds);
  jest.spyOn(dataFeedService, 'createAWSCredentials').mockResolvedValue(awsCreds);

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
  done();
});

it('should scroll to top when request is failed', async (done) => {
  jest.spyOn(dataFeedService, 'createMapping').mockRejectedValue(true);

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  Component.setState({ go1Fields: fakeMappingFields });

  const ComponentInstance = Component.instance();
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');
  ComponentInstance.onMapField(fakeMappingFields[1], 'First Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Last Name');

  await ComponentInstance.onMappingDone();
  expect(scrollToTopFn).toHaveBeenCalled();
  done();
});

it('should show date validation when date format is wrong', async (done) => {
  jest.spyOn(dataFeedService, 'createMapping').mockRejectedValue({ response: { data: { errors: [{ title: 'date_value' }]  } } });

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  Component.setState({ go1Fields: fakeMappingFields });

  const ComponentInstance = Component.instance();
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');
  ComponentInstance.onMapField(fakeMappingFields[1], 'First Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Last Name');

  await ComponentInstance.onMappingDone();
  Component.update();
  const UploadErrorComponent = Element.findWhere((n) => n.prop('data-testid') === 'UploadError').at(0);
  expect(UploadErrorComponent.text()).toEqual('Invalid date format. Please edit your file follow this format: YYYY-MM-DD')
  done();
});
