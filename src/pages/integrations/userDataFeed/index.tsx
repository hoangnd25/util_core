import * as React from 'react';
import {connect} from "react-redux";
import { Text, View } from '@go1d/go1d';
import { PortalModel } from '@go1d/go1d-exchange';
import withAuth from '../../../components/WithAuth';
import Integrations from '../index';
import SidebarMenus from '../../../components/SidebarMenus';
import DataFeedEmptyState from '../../../components/dataFeed/emptyState';
import DataFeedUploadState from '../../../components/dataFeed/uploadState';

interface Props {
  currentSession: any;
}

interface State {
  step: number;
}

export class UserDataFeed extends Integrations {
  state = {
    step: 0,
  };

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

  onChangeStep = (step: number) => {
    this.setState({ step })
  };

  renderBody() {
    const { step } = this.state;
    const { currentSession } = this.props;

    return (
      <View minHeight={600}>
        {step === 0 && (
          <DataFeedEmptyState onStart={this.onChangeStep} />
        )}
        {step === 1 && (
          <View flexDirection="row" flexWrap="wrap">
            <View width={[1,1,3/5]} alignItems="flex-start">
              <DataFeedUploadState currentSession={currentSession} onCancel={this.onChangeStep} />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapCurrentSessionToProps = state => ({ currentSession: state.currentSession });

export default withAuth(connect(
  mapCurrentSessionToProps,
  null
)(UserDataFeed));
