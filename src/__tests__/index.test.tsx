import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from "redux-mock-store";
import CommonProvider from '@go1d/mine/common/Provider';
import { UserDataFeed } from '../pages/integrations/userDataFeed';

const intlMock = {
  formatMessage: jest.fn(),
};

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
          <UserDataFeed intl={intlMock} currentSession={currentSession} {...props} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('renders without crashing step = 0', () => {
  setup();
});

it('renders without crashing step = 1', () => {
  const Element = setup();
  const Page = Element.find(UserDataFeed);
  (Page.instance() as any).onChangeStep(1);
  expect(Page.state('step')).toEqual(1);
});
