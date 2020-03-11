import { mount } from 'enzyme';
import * as React from 'react';
import SidebarMenus from './index';

const fakeMenus = [
  {
    id: 'Menu ID',
    title: 'Menu Name',
    href: 'https://menu.href',
    isApiomLink: true,
    isVisible: true,
  },
];

it('renders without crashing', () => {
  mount(
    <SidebarMenus menus={fakeMenus} />
  );
});

it('renders active link without crashing', () => {
  mount(
    <SidebarMenus active="Menu ID" menus={fakeMenus} />
  );
});

it('onchange item and go to apiom', () => {
  delete window.location;
  window.location = { assign: jest.fn() } as any;
  const Component = mount(
    <SidebarMenus active="Menu ID" menus={fakeMenus} />
  );
  (Component.instance() as any ).onChangeMenu({ target: { value: 'Menu ID' } });
  expect(window.location.assign).toHaveBeenCalledWith('/p/#/https://menu.href');
});
