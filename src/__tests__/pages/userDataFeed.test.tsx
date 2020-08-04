import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from "redux-mock-store";
import CommonProvider from '@go1d/mine/common/Provider';
import { UserDataFeed, dataFeedService } from '@src/pages/r/app/portal/integrations/user-data-feed';
import { setupI18n } from '@lingui/core';
import en from '@src/locale/en/messages';

const i18n = setupI18n({ language: 'en', catalogs: {en} });
const mockComponent = () => <div />;

beforeEach(() => {
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
});

const setup = (props = {}) => {
  const componentProps = {
    ...props,
    scrollToTop: jest.fn(),
  };
  const currentSession = {
    portal: {
      id: 123,
      configuration: {
        integrations: {},
      },
    },
    account: {
      id: 123,
      isAdministrator: true,
    },
  };
  const mockStore = configureMockStore();
  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <CommonProvider
          pushNavigationState={jest.fn}
          apiUrl="go1.api.com"
          jwt="123"
          accountId={123}
          portalId={123}
        >
          <UserDataFeed i18n={i18n} {...componentProps} currentSession={currentSession} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('renders without crashing', () => {
  setup({
    featureToggles: {},
  });
});

it('Should able to jump to top', () => {
  const Element = setup({
    featureToggles: {},
  });
  const Page = Element.find(UserDataFeed);

  //Page.prop('scrollToTop')();
});

it('renders with mapping data', async () => {
  const fakeAWSCredentials = {
    awsBucketUrl: 's3://cd22d769e7d5.credential.name',
    awsAccessKeyId: 'cd22d769e7d5',
    awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
  };
  const fakeMapping = {
    mappings: {
      mail: 'Email',
      first_name: 'First Name',
    },
    updated: 1573009968977,
    author: {
      fullName: 'Testing User',
    },
  };

  spyOn(dataFeedService, 'fetchAWSCredentials').and.callFake(() => Promise.resolve(fakeAWSCredentials));
  spyOn(dataFeedService, 'fetchMappingData').and.callFake(() => Promise.resolve(fakeMapping));

  const Element = setup({
    featureToggles: {},
  });
  const Page = Element.find(UserDataFeed);
  await (Page.instance() as any).fetchData();

  expect(Page.state('isLoading')).toBeFalsy();
  expect(Page.state('mappingData')).toEqual(fakeMapping);
  expect(Page.state('awsCredential')).toEqual(fakeAWSCredentials);
});
