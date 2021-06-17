import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import withI18n, { getLocale, defaultLocale } from '.';
import { currentSessionMock } from '../WithAuth/mocks/authMocks';

/** TEST SETUP * */
let Component;

const mockStore = configureStore([]);
const store = mockStore(authenticatedStoreState);

jest.spyOn(store, 'getState').mockReturnValue({
  currentSession: currentSessionMock,
});

jest.mock('@src/locale/en-US/messages.po', () => ({
  messages: {
    'Something!': 'Something!',
  },
}));

const TestComp = () => {
  return <div>Something!</div>;
};

const setup = (props: any = {}) => {
  Component = withI18n(TestComp);
  return mount(<Component store={store} />);
};

describe('With18n', () => {
  it('should render with translation', (done) => {
    const wrapper = setup();
    Component.getInitialProps({ router: { query: {} }, ctx: { store } });
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('div').text()).toBe('Something!');
      done();
    });
  });
});

describe('getLocale', () => {
  it('should return default locale', () => {
    const locale = getLocale(null);
    expect(locale).toBe(defaultLocale);
  });

  it('should return portal locale', () => {
    const session = { ...currentSessionMock } as any;
    session.portal.configuration.locale = 'AU';

    const locale = getLocale(session);
    expect(locale).toBe(defaultLocale);
  });

  it('should return user locale', () => {
    const session = { ...currentSessionMock } as any;
    session.user.locale = ['fr'];

    const locale = getLocale(session);
    expect(locale).toBe('fr');
  });
});
