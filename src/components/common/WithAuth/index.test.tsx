import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { View } from '@go1d/go1d';
import CommonProvider from "@go1d/mine/common/Provider";
import MockAdapter from 'axios-mock-adapter';
import createHttp from "@src/utils/http";
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import unauthenticatedStoreState from '@src/store/mocks/unauthenticatedStore';
import withAuth, { withCurrentSession } from './index';
import LinkComponent from "../Link/index";
import { loginResponseMock, currentSessionMock } from "./mocks/authMocks";
import Router from 'next/router';

/** TEST SETUP * */
let Component;

class App extends React.Component {
  render = () => <View />
}
const http = createHttp();



jest.mock('next/router', () => ({
  Router() {
    return {
      route: '',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
    };
  },
}));

const mockStore = configureStore([]);
const defaultStore = mockStore();

const setup = (props: any = {}) => {
  Component = withCurrentSession(App, { http });
  return mount(<Component router={{ query: { oneTimeToken:"aaa" }, push: () => jest.fn(), replace :() => {}, asPath: { replace :() => {} } }} store={defaultStore} {...props}/>);
};

const checkAuthStatus = currentSession => {
  expect(currentSession).toMatchObject(currentSessionMock);
  expect(localStorage.getItem('jwt')).toBe(currentSessionMock.jwt);
  expect(localStorage.getItem('uuid')).toBe(currentSessionMock.user.uuid);
  expect(parseInt(localStorage.getItem('active-instance'))).toBe(parseInt(currentSessionMock.portal.id,10));
  expect(localStorage.getItem('active-instance-domain')).toBe(currentSessionMock.portal.title);
};
/** TEST SETUP END * */

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

it('does client side one time login token login', done => {
  const Mock = new MockAdapter(http);
  Mock.onGet().reply(200, loginResponseMock);
  const wrapper = setup() as any;
  Component.getInitialProps({ router: { query: {} }, ctx: { req:{}, store: defaultStore } });
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("App").length).toBe(1);
    expect(wrapper.find("View").length).toBe(1);
    checkAuthStatus(wrapper.instance().state.currentSession);
    done();
  });
});

it('handles login error correctly', done => {
  const Mock = new MockAdapter(http);
  Mock.onGet().reply(403, {});
  const wrapper = setup() as any;
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("App").length).toBe(1);
    expect(wrapper.find("View").length).toBe(1);
    expect(wrapper.instance().state.currentSession).toMatchObject({ authenticated: false });
    done();
  });
});

it('processes ssr information correctly', done => {
  const wrapper = setup({ currentSession: currentSessionMock }) as any;
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("App").length).toBe(1);
    expect(wrapper.find("View").length).toBe(1);
    checkAuthStatus(wrapper.instance().state.currentSession);
    done();
  });
});

it('processes localStorage login correctly', done => {
  localStorage.setItem('jwt', currentSessionMock.jwt);
  localStorage.setItem('uuid', currentSessionMock.user.uuid);
  localStorage.setItem('active-instance', currentSessionMock.portal.id);
  localStorage.setItem('active-instance-domain', currentSessionMock.portal.title);
  const Mock = new MockAdapter(http);
  Mock.onGet().reply(200, loginResponseMock);
  const wrapper = setup({ router: { query: {}, replace :() => {}, asPath: { replace :() => {} } } }) as any;
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("App").length).toBe(1);
    expect(wrapper.find("View").length).toBe(1);
    checkAuthStatus(wrapper.instance().state.currentSession);
    done();
  });
});

it('Test withAuth redirects if no login state', () => {
  delete window.location;
  window.location = { assign: jest.fn() } as any;
  const store = mockStore(unauthenticatedStoreState);
  const Component = withAuth(App);
  const wrapper = mount(<IntlProvider locale="en"  defaultLocale="en" onError={()=> {}}>
      <CommonProvider linkComponent={LinkComponent}>
        <Provider store={store}>
          <Component/>
        </Provider>
      </CommonProvider>
    </IntlProvider>
  );
  expect((window.location.assign as any).mock.calls.length).toBe(1);
});


it('Test withAuth no redirects if login state', () => {
  delete window.location;
  window.location = { assign: jest.fn() } as any;
  const store = mockStore(authenticatedStoreState);
  const Component = withAuth(App);
  Component.getInitialProps({ router: { query: {} }, ctx: { req:{} } });
  const wrapper = mount(<IntlProvider locale="en"  defaultLocale="en" onError={()=> {}}>
      <CommonProvider linkComponent={LinkComponent}>
        <Provider store={store}>
          <Component/>
        </Provider>
      </CommonProvider>
    </IntlProvider>
  );
  expect((window.location.assign as any).mock.calls.length).toBe(0);
  expect(wrapper.find("App").length).toBe(1);
});
