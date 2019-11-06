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
    },
  };
  return mount(
    <IntlProvider locale="en">
      <DataFeedUploadState scrollToTop={scrollToTopFn} onCancel={fakeOnCancel} currentSession={currentSession} intl={jest.fn()} {...props} />
    </IntlProvider>
  );
};

it('renders without crashing', () => {
  spyOn(dataFeedService, 'fetchMappingFields').and.callFake(() => Promise.resolve());
  setup();

  expect(dataFeedService.fetchMappingFields).toHaveBeenCalledWith(123);
});

it('Should init with default step', () => {
  spyOn(dataFeedService, 'fetchMappingFields').and.callFake(() => Promise.resolve());

  const Element = setup({ defaultStep: 2 });
  const Component = Element.find('DataFeedUploadState') as any;
  expect(Component.state('step')).toEqual(2);
});

it('should return correct mapped fields', async () => {
  spyOn(dataFeedService, 'createMapping').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'fetchAWSCredentials').and.callFake(() => Promise.resolve());
  spyOn(dataFeedService, 'createAWSCredentials').and.callFake(() => Promise.resolve());

  const Element = setup();
  const Component = Element.find('DataFeedUploadState') as any;
  const ComponentInstance = Component.instance();

  expect(Component.state('touched')).toBeFalsy();
  Component.setState({ go1Fields: fakeMappingFields });
  ComponentInstance.onMapField(fakeMappingFields[0], 'Email');

  const mappedFields = [{
    label: 'mail',
    mappedField: 'Email',
    name: 'mail',
    options: [],
    published: true,
    required: true,
    type: 'string',
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
  }];
  expect(Component.state('touched')).toBeTruthy();
  expect(Component.state('go1Fields')).toEqual(mappedFields);
  expect(ComponentInstance.validate()).toBeFalsy();

  ComponentInstance.onMapField(fakeMappingFields[1], 'First Name');
  ComponentInstance.onMapField(fakeMappingFields[2], 'Last Name');

  expect(ComponentInstance.validate()).toBeTruthy();
  expect(ComponentInstance.mapFields()).toEqual({
    mail: 'Email',
    first_name: 'First Name',
    last_name: 'Last Name',
    status: '',
  });

  await ComponentInstance.onMappingDone();
  const mappingPayload = {
    type: 'account',
    mappings: {
      mail: 'Email',
      first_name: 'First Name',
      last_name: 'Last Name',
      status: '',
    },
    rows: [],
  }
  expect(dataFeedService.createMapping).toHaveBeenCalledWith(mappingPayload, 123);
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
