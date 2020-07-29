import * as React from 'react';
import Router from 'next/router';
import { Spinner, Text, View, ButtonFilled, Banner } from '@go1d/go1d';
import { SIDEBAR_MENUS } from '@src/constants';
import { CurrentSessionType } from '@src/types/user';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import MicrosoftAzureService from '@src/services/microsoftAzure';
import TabMenuNavigation from '@src/components/common/TabMenuNavigation';
import ContentDistributorExport from '@src/components/ContentDistributorExport';

interface Props {
  currentSession: CurrentSessionType;
}

interface State {
  isLoading: boolean,
  sessionId?: string,
  error: any | null,
  connection: any | null,
}

export const microsoftAzureService = MicrosoftAzureService();

export class MicrosoftAzurePage extends React.Component<Props,State> {
  state = {
    isLoading: true,
    error: null,
    connection: null,
  };

  componentDidMount() {
    const { error_code: errorCode, session_id: sessionId }: {error_code?:string, session_id?:string} = Router.query;

    if (errorCode) {
      const error = {
        sessionId,
        message: this.mapErrorMessage(errorCode),
      };
      this.setState({error, sessionId});
    }
    
    this.getMicrosoftAzureConnection();
  }

  handleConnect = () => {
    const { currentSession: { portal } } = this.props;
    microsoftAzureService.getRedirectLink(portal.title);
  }

  public render() {
    const { currentSession } = this.props;
    const { isLoading, error, connection } = this.state;

    if (isLoading) {
      return (
        <View minHeight="60vh" justifyContent="center" alignItems="center">
          <Spinner size={3} />
        </View>
      )
    }
    return (
      <TabMenuNavigation>
        <View label="Connect">
          <View alignItems="flex-start" paddingTop={5}>
            {error && (
              <Banner type="danger" marginBottom={4}>
                <Text>{error.message}</Text>
                <Text>Support ID: {error.sessionId}</Text>
              </Banner>
            )}
            {connection ? (<>
              <Text>Your portal is connected with Microsoft Azure.</Text>
            </>) : (<>
              <Text>Your portal can be configured to enable login with Microsoft Azure.</Text>
            </>)}
            <ButtonFilled 
              color="accent" 
              marginTop={5}
              onClick={this.handleConnect}
            >
              {connection ? `Reconnect with Microsoft Azure` : `Connect with Microsoft Azure` }
            </ButtonFilled>
          </View>
        </View>
        <View label="Graph Connector Export">
          <ContentDistributorExport targetName="graph-connector" portal={currentSession.portal} />
        </View>
      </TabMenuNavigation>
    );
  }

  private async getMicrosoftAzureConnection() {
    const { currentSession: { portal } } = this.props;
    try {
      const connection = await microsoftAzureService.getConnection(portal.title);
      this.setState({ connection, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
    }
  }

  private mapErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'SSO:PortalNotFound':
        return 'Portal details could not be found. Please contact your Administrator to setup Single Sign On for your portal';
      case 'SSO:UnknownIdentityProvider':
        return 'The Identity Provider is currently not available. Please contact your Administrator.';
      case 'SSO:PermissionDenied':
        return 'Permission Denied. Your account does not have access. Please contact your Administrator.';
      case 'SSO:InternalServerError':
        return 'An unexpected error occurred. Please try again later.';
      case 'SSO:ProviderError':
        return 'An unexpected error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
}

export default withAuth(withIntegrations(MicrosoftAzurePage, { active: SIDEBAR_MENUS.MICROSOFT_AZURE }));