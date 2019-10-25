import * as React from 'react';
import { Text, View } from '@go1d/go1d';
import { PortalModel } from '@go1d/go1d-exchange';
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

  renderAWSConnectionDetail() {
    const { currentSession } = this.props;
    const portal = new PortalModel(currentSession.portal || {});
    return (
      <>
        renderAWSConnectionDetail: {JSON.stringify(portal)}
      </>
    );
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
      <>
        renderAWSConnectionBody: {this.renderAWSConnectionDetail()}
      </>
    );
  }
}

export default withAuth(UserDataFeed);
