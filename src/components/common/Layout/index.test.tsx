import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import CommonProvider from '@go1d/mine/common/Provider';
import Layout from './index';
import LinkComponent from '@src/components/common/Link';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';

const mockStore = configureStore([]);

const menuItem = {
  id: 'id',
  title: 'Test',
  href: '/test',
  isApiom: true,
  isVisible: true,
};

const setup = (props: any = {}) => {
  const store = mockStore(authenticatedStoreState);
  return mount(<IntlProvider locale="en"  defaultLocale="en" onError={()=> {}}>
      <CommonProvider linkComponent={LinkComponent}>
          <Provider store={store}>
            <Layout
              {...props}
            />
          </Provider>
      </CommonProvider>
    </IntlProvider>,
  );
}

it('renders without crashing', () => {
  setup();
});

it('renders TopNav and wrapping container without crashing', () => {
  const wrapper = setup({wrappingContainer: true, withTopNav: true});
  expect(wrapper.find("Head").length).toBe(1);
  expect(wrapper.find("LayoutWithNav").length).toBe(1);
  expect(wrapper.find("TopMenu").length).toBe(1);
});

it('renders SideNav and wrapping container without crashing', () => {
  const wrapper = setup({wrappingContainer: true, withSideNav: {title: 'Menu', menu: [menuItem], active: 'id'}});
  expect(wrapper.find("Head").length).toBe(1);
  expect(wrapper.find("LayoutWithSideNav").length).toBe(1);

  const event = {target: {name: "Test", value: "id"}};
  wrapper.find("Select").simulate('change', event);
});
