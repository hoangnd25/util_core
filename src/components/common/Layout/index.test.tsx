import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import CommonProvider from '@go1d/mine/common/Provider';
import LinkComponent from '@src/components/common/Link';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import Layout from './index';

const mockStore = configureStore([]);

const menuItem = {
  id: 'id',
  title: 'Test',
  href: '/test',
  isApiomLink: true,
  isVisible: true,
};

const setup = (props: any = {}) => {
  const store = mockStore(authenticatedStoreState);
  return mount(
    <CommonProvider linkComponent={LinkComponent}>
      <Provider store={store}>
        <Layout {...props} />
      </Provider>
    </CommonProvider>
  );
};

it('renders without crashing', () => {
  setup();
});

it('renders TopNav and wrapping container without crashing', () => {
  const wrapper = setup({ wrappingContainer: true, withTopNav: true });
  expect(wrapper.find('Head').length).toBe(1);
  expect(wrapper.find('LayoutWithNav').length).toBe(1);
  expect(wrapper.find('TopMenu').length).toBe(1);
});

it('renders SideNav and wrapping container without crashing', () => {
  const wrapper = setup({ wrappingContainer: true, withSideNav: { title: 'Menu', menu: [menuItem], active: 'id' } });
  expect(wrapper.find('Head').length).toBe(1);
  expect(wrapper.find('LayoutWithSideNav').length).toBe(1);

  const layoutSideNav = wrapper.find('LayoutWithSideNav');
  (layoutSideNav.instance() as any).onChangeMenu({ target: { value: 'id' } });
});
