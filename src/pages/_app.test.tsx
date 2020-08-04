import { mount } from 'enzyme';
import * as React from 'react';
import { View } from '@go1d/go1d';
import { currentSessionMock } from "@src/components/common/WithAuth/mocks/authMocks";

import configureStore from 'redux-mock-store';
import { LoadingSpinner } from '@src/components/common/Suspense';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import { GO1App } from './_app';

/** TEST SETUP * */
const mockStore = configureStore([]);

const setup = (props: any = {}) => {
  return mount(<GO1App Component={AppPage} router={{ query: {}, push: () => {} }} {...props}/>);
};

class AppPage extends React.Component {
  public static async getInitialProps() { return { abc: 1 }}
;
  render = () => <View />
}

/** TEST SETUP END * */

it('shows loading', async () => {
  const wrapper = setup({ currentSession:null }) as any;
  expect(wrapper.find(LoadingSpinner).length).toBe(1);
});

it('Retrieves parent props and sets headers', async () => {
  const setHeaderMock = jest.fn();
  const parentInitialProps = await GO1App.getInitialProps({ Component: AppPage, router: { query: {}, push: () => {} }, ctx: { res:{ setHeader: setHeaderMock } }, req:{} });
  expect(parentInitialProps).toMatchObject({ pageProps: { abc: 1 } });
  expect(setHeaderMock.mock.calls.length).toBeGreaterThan(0);
});

it('heartbeat routes work', async () => {
  const endMock = jest.fn();
  const parentInitialProps = await GO1App.getInitialProps({ Component: AppPage, router: { query: {}, push: () => {}, asPath: "/healthz" }, ctx: { res:{ end: endMock, setHeader: jest.fn() } }, req:{} });
  expect(parentInitialProps).toMatchObject({ pageProps: { abc: 1 } });
  expect(endMock.mock.calls.length).toBe(1);
  expect(endMock.mock.calls[0][0]).toBe("Ok");
});

it('shows login state properly', () => {
  const store = mockStore(authenticatedStoreState);
  const wrapper = setup({ currentSession:currentSessionMock, store }) as any;
  expect(wrapper.find("AppPage").length).toBe(1);
  expect(wrapper.find("NotificationContainer").length).toBe(1);
});
