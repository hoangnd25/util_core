import * as React from 'react';
import { Spinner, Text, View } from '@go1d/go1d';
import { injectIntl } from 'react-intl';
import DataFeedService from '../../../services/dataFeed';
import { AWSCredential } from '../../../types/userDataFeed';
import { defineMessagesList } from '../../../utils/translation';
import withAuth from '../../../components/common/WithAuth';
import SidebarMenus from '../../../components/SidebarMenus';
import AWSConnectionDetail from '../../../components/awsConnectionDetail';
import DataFeedEmptyState from '../../../components/dataFeed/emptyState';
import DataFeedUploadState from '../../../components/dataFeed/uploadState';
import Integrations from '../index';

const dataFeedService = DataFeedService();

interface Props {
  currentSession: any;
}

interface State {
  step: number;
  isLoading: number;
  awsCredential: AWSCredential;
}

export class UserDataFeed extends Integrations {
  state = {
    step: 0,
    isLoading: true,
    awsCredential: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { currentSession } = this.props;
    dataFeedService.fetchAWSCredentials(currentSession.portal.id)
      .then(awsCredential => this.setState({ awsCredential, isLoading: false }))
      .catch(() => this.setState({ isLoading: false }));
  }

  getPageTitle() {
    const { intl } = this.props;
    return intl.formatMessage(defineMessagesList().integrationUserDataFeedPageTitle);
  }

  renderSidebar() {
    const { intl } = this.props;
    const sidebarMenus = this.getSidebarMenus();
    const sidebarTitle = intl.formatMessage(defineMessagesList().integrationUserDataFeedSidebarTitle);

    return (
      <>
        <View marginBottom={3}>
          <Text element="h3" fontWeight="semibold" fontSize={3}>{sidebarTitle}</Text>
        </View>

        <SidebarMenus
          active="sidebar.integrations-user-data-feed"
          menus={sidebarMenus}
        />
      </>
    );
  }

  onChangeStep(step: number) {
    this.setState({ step })
  }

  fetchAWSCredentials(portalId: number) {
    dataFeedService.fetchAWSCredentials(portalId)
      .then(awsCredential => this.setState({ awsCredential }));
  }

  renderBody() {
    const { step, isLoading, awsCredential } = this.state;
    const { intl, currentSession } = this.props;
    const yourDataFeedTitle = intl.formatMessage(defineMessagesList().integrationUserDataFeedConnectionDetailTitle);

    if (isLoading) {
      return (
        <Spinner size={3} />
      );
    }

    if (awsCredential) {
      return (
        <View minHeight="60vh">
          <View marginBottom={5}>
            <Text element="h3" fontSize={4} fontWeight="semibold">{yourDataFeedTitle}</Text>
          </View>

          <AWSConnectionDetail
            backgroundColor="faint"
            expandable={true}
            awsCredential={awsCredential}
          />
        </View>
      );
    }

    return (
      <View minHeight="60vh">
        {step === 0 && (
          <DataFeedEmptyState onStart={step => this.onChangeStep(step)} />
        )}

        {step === 1 && (
          <DataFeedUploadState
            currentSession={currentSession}
            onDone={() => this.fetchAWSCredentials(currentSession.portal.id)}
            onCancel={step => this.onChangeStep(step)}
          />
        )}
      </View>
    );
  }
}

export default injectIntl(withAuth(UserDataFeed));
