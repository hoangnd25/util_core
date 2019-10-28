import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import DataFeedUploadState, { dataFeedService } from './uploadState';
import { BaseUploader } from '@go1d/go1d';
import csvParser from 'papaparse';

const fakeOnCancel = jest.fn();

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
      <DataFeedUploadState onCancel={fakeOnCancel} currentSession={currentSession} intl={jest.fn()} {...props} />
    </IntlProvider>
  );
};

it('renders without crashing', () => {
  setup();
});

it('should call createMapping parse csv done', async () => {
  const spyCreateMapping = spyOn(dataFeedService, 'createMapping').and.callFake( () => Promise.resolve({}));
  const Element = setup();
  (Element.find('DataFeedUploadState').instance() as any).onParseCsvDone([
    ['first_name', 'mail'],
    ['go1', 'go1@mail.com'],
  ]);
  expect(spyCreateMapping).toHaveBeenCalledWith({
    type: 'account',
    mappings: {
      csv_mail: 'mail',
      csv_first_name: 'first_name',
    },
    rows: [
      ['csv_mail', 'csv_first_name'],
      ['go1', 'go1@mail.com'],
    ],
  }, 123);
});

it('should call createMapping parse csv successfully', async () => {
  const spyCreateMapping = spyOn(dataFeedService, 'createMapping').and.callFake( () => Promise.resolve({}));
  spyOn(csvParser, 'parse').and.callFake( (file, { complete }) => complete({
    data: [
      ['first_name', 'mail'],
      ['go1', 'go1@mail.com'],
    ],
    errors: [],
  }));
  const Element = setup();
  Element.find(BaseUploader).prop('onChange')([new File([], "file")]);
  expect(spyCreateMapping).toHaveBeenCalledWith({
    type: 'account',
    mappings: {
      csv_mail: 'mail',
      csv_first_name: 'first_name',
    },
    rows: [
      ['csv_mail', 'csv_first_name'],
      ['go1', 'go1@mail.com'],
    ],
  }, 123);
});
