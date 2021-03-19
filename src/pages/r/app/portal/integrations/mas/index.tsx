import * as React from 'react';
import { View, Text, Provider, Spinner } from '@go1d/go1d';
import { colors } from '@go1d/go1d/build/foundations';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS_INTEGRATIONS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import AppContext from '@src/utils/appContext';
import CopyTextInput from '@src/components/common/CopyTextInput';
import AuthService from '@src/services/authService';

interface Props {
  currentSession: CurrentSessionType;
}

export class Mas extends React.Component<Props, any> {
  state = {
    copied: false,
    masClient: { client_id: "", client_secret: ""},
    loading: true
  };

  clientName = "MAS Integration";

  authService = null;

  constructor(props) {
    super(props);
    this.authService = AuthService();
  }

  async createMasClient() : Promise<void> {
    const { currentSession } = this.props;
    const portalTitle = currentSession.portal.title;
    return this.authService.createClients({clientName: this.clientName, portalName: portalTitle, redirectUrl: `https://${portalTitle}` })
  }

  async findMasClient() : Promise<any> {
    const { currentSession } = this.props;
    const clients = await this.authService.loadClients({portal_name: currentSession.portal.title});
    const masClient = clients.filter(client => client.client_name === this.clientName);
    if(masClient.length > 0) {
      return masClient[0];
    }
    return null;
  }

  async componentDidMount(): Promise<void> {
    const { currentSession } = this.props;
    await this.authService.exchangeAuthToken(currentSession);
    let masClient = await this.findMasClient();
    if(!masClient) {
      await this.createMasClient();
      masClient = await this.findMasClient();
    }
    this.setState({masClient, loading: false})
  }

  render() {
    const { masClient: { client_id = "", client_secret = ""}, loading } = this.state;
    const theme = {
      colors: {
        ...colors,
        accent: '#1A778F',
      },
    };

    return (
      <Provider theme={theme as any}>
        <View flexDirection="column" paddingTop={4}>
          {loading && <View justifyContent="center" alignItems="center"><Spinner size={6} /></View>}
          {!loading && <>
            <Text color="subtle">Use the generated credentials to complete the integration.</Text>
            <View flexDirection="row" width="100%" justifyContent="space-between" paddingTop={3}>
              <View width="48%">
                <CopyTextInput fieldName="Client ID" fieldValue={client_id} />
              </View>
              <View width="48%">
                <CopyTextInput fieldName="Client Secret" fieldValue={client_secret} />
              </View>
            </View>
          </>}
        </View>
      </Provider>
    );
  }
}

Mas.contextType = AppContext;
export default withAuth(withIntegrations(Mas, { active: SIDEBAR_MENUS_INTEGRATIONS.MAS }));
