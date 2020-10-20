import * as React from 'react';
import { Trans } from '@lingui/macro';
import { View, Form, Field, TextInput, SubmitButton, NotificationManager, Provider, Spinner, Text } from '@go1d/go1d';
import { colors } from '@go1d/go1d/build/foundations';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import PortalService from '@src/services/portalService';

export const portalService = PortalService();

interface Props {
  currentSession: CurrentSessionType;
}

export class Litmos extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchAccountData();
  }

  render() {
    const { accountData, isLoading } = this.state;
    const theme = {
      colors: {
        ...colors,
        accent: '#1A778F',
      },
    };

    return (
      <Provider theme={theme as any}>
        <View marginBottom={4} minHeight="40vh">
          {isLoading ? (
            <View minHeight="20vh" justifyContent="center" alignItems="center">
              <Spinner size={6} />
            </View>
          ) : (
            <Form
              initialValues={{
                username: (accountData && accountData.username) || '',
                password: (accountData && accountData.password) || '',
                apikey: (accountData && accountData.apikey) || '',
              }}
              onSubmit={values => this.saveAccountData(values)}
            >
              <Text color="subtle">Enter your credentials to complete this integration.</Text>
              <View marginTop={4} flexDirection="row" justifyContent="space-between" paddingTop={3}>
                <View width="48%">
                  <Field
                    component={TextInput}
                    name="username"
                    label="Username"
                    viewCss={{ boxShadow: 'none' }}
                    size="sm"
                    required
                  />
                </View>
                <View width="48%">
                  <Field
                    component={TextInput}
                    name="password"
                    label="Password"
                    viewCss={{ boxShadow: 'none' }}
                    size="sm"
                    required
                  />
                </View>
              </View>
              <View marginTop={4}>
                <Field
                  component={TextInput}
                  name="apikey"
                  label="Api key"
                  viewCss={{ boxShadow: 'none' }}
                  size="sm"
                  required
                />
              </View>
              <SubmitButton marginTop={6} width="fit-content">
                Save
              </SubmitButton>
            </Form>
          )}
        </View>
      </Provider>
    );
  }

  private async saveAccountData(integrationSettings) {
    const { currentSession } = this.props;
    const portalName = currentSession.portal && currentSession.portal.title;
    const accountData = await portalService.saveIntegrationConfiguration(portalName, 'litmos', integrationSettings);

    if (accountData) {
      this.setState({ accountData, isLoading: false });
      this.fetchAccountData();
      NotificationManager.success({
        message: <Trans>Settings saved.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
    } else {
      this.setState({ accountData: false, isLoading: false });
      NotificationManager.danger({
        message: <Trans>Settings failed to save.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
    }
  }

  private async fetchAccountData() {
    const { currentSession } = this.props;
    const portalName = currentSession.portal && currentSession.portal.title;
    const accountData = await portalService.fetchIntegrationConfiguration(portalName, 'litmos');
    this.setState({ accountData, isLoading: false });
  }
}

export default withAuth(withIntegrations(Litmos, { active: SIDEBAR_MENUS.LITMOS }));
