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
