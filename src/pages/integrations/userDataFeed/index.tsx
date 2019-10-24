import * as React from 'react';
import { Text, View } from '@go1d/go1d';
import withAuth from '../../../components/WithAuth';
import Integrations from '../index';
import SidebarMenus from '../../../components/SidebarMenus';

export class UserDataFeed extends Integrations {
  constructor(props) {
    super(props);
  }

  getPageTitle() {
    return 'User data feed';
  }

  renderSidebar() {
    const sidebarMenus = this.getSidebarMenus();

    return (
      <>
        <View marginBottom={3}>
          <Text element="h3" fontWeight="semibold" fontSize={3}>Integrations</Text>
        </View>

        <SidebarMenus
          active="sidebar.integrations-user-data-feed"
          menus={sidebarMenus}
        />
      </>
    );
  }

  renderBody() {
    return (
      <Text>DataFeed content</Text>
    );
  }
}

export default withAuth(UserDataFeed);
