import * as React from 'react';
import { Trans } from '@lingui/macro';
import { View, Form, Field, TextInput, SubmitButton, NotificationManager, Provider, Spinner, Text, PasswordInput  } from '@go1d/go1d';
import { colors } from '@go1d/go1d/build/foundations';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS_INTEGRATIONS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withApiom from '@src/components/common/WithApiom';
import PortalService from '@src/services/portalService';
import AppContext from '@src/utils/appContext';

interface Props {
  currentSession: CurrentSessionType;
}

export class Litmos extends React.Component<Props, any> {
  context!: React.ContextType<typeof AppContext>;
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
        <View marginBottom={4} minHeight="40vh" css={{ marginTop: '-16px'}}>
          {isLoading ? (
            <View minHeight="20vh" justifyContent="center" alignItems="center">
              <Spinner size={6} />
            </View>
          ) : (
            <Form
              initialValues={{
                username: (accountData && accountData.username) || '',
                password: (accountData && accountData.password) || '',
              }}
              onSubmit={values => this.saveAccountData(values)}
            >
              <Text color="subtle">Enter your credentials to complete this integration.</Text>
              <View marginTop={4} flexDirection="row" justifyContent="space-between" >
                <View width="48%">
                  <Field
                    component={TextInput}
                    name="username"
                    label="Username"
                    viewCss={{ boxShadow: 'none' }}
                    required
                  />
                </View>
                <View width="48%">
                  <Field
                    component={PasswordInput}
                    name="password"
                    label="Password"
                    viewCss={{ boxShadow: 'none' }}
                    required
                  />
                </View>
              </View>
              <SubmitButton marginTop={4} width="fit-content">
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
    const { http } = this.context;
    const portalName = currentSession.portal && currentSession.portal.title;

    const portalService = PortalService(http);
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
    const { http } = this.context;
    const portalName = currentSession.portal && currentSession.portal.title;
    const portalService = PortalService(http);
    const accountData = await portalService.fetchIntegrationConfiguration(portalName, 'litmos');
    this.setState({ accountData, isLoading: false });
  }
}
Litmos.contextType = AppContext;

export default withAuth(withApiom(Litmos, { active: SIDEBAR_MENUS_INTEGRATIONS.LITMOS }));
