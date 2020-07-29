import * as React from 'react';
import { Trans } from '@lingui/macro';
import {
  View,
  Form,
  Field,
  TextInput,
  SubmitButton,
  NotificationManager,
} from '@go1d/go1d';
import IconCheck from '@go1d/go1d/build/components/Icons/Check';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import TabMenuNavigation from '@src/components/common/TabMenuNavigation';
import PortalService from '@src/services/portalService';
import ContentDistributorExport from '@src/components/ContentDistributorExport';

export const portalService = PortalService();

interface Props {
  currentSession: CurrentSessionType;
}

export class Oracle extends React.Component<Props, any> {
  private child: React.RefObject<TabMenuNavigation> = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.child = React.createRef();
  }

  componentDidMount() {
    this.fetchAccountData();
  }

  accessChild = tab => {
    this.child.current.onClickTabItem(tab);
  };

  render() {
    const { accountData } = this.state;
    const { currentSession } = this.props;

    return (
      <View marginBottom={4}>
        <TabMenuNavigation ref={this.child}>
          <View label="Account Settings">
            <View paddingTop={6}>
              <Form
                initialValues={{
                  domain: (accountData && accountData.domain) || '',
                  username: (accountData && accountData.username) || '',
                  password: (accountData && accountData.password) || '',
                }}
                onSubmit={values => this.saveAccountData(values)}
              >
                <View marginTop={4}>
                  <Field component={TextInput} name="domain" label="Domain" size="sm" required />
                </View>
                <View marginTop={4}>
                  <Field component={TextInput} name="username" label="Username" size="sm" required />
                </View>
                <View marginTop={4}>
                  <Field component={TextInput} name="password" label="Password" size="sm" required />
                </View>
                <SubmitButton marginTop={6} icon={IconCheck} width="fit-content">
                  Submit
                </SubmitButton>
              </Form>
            </View>
          </View>
          <View label="Export">
            <ContentDistributorExport targetName="oracle" portal={currentSession.portal} />
          </View>
        </TabMenuNavigation>
      </View>
    );
  }

  private async saveAccountData(integrationSettings) {
    const { currentSession } = this.props;
    const portalName = currentSession.portal && currentSession.portal.title;
    const accountData = await portalService.saveIntegrationConfiguration(portalName, 'oracle', integrationSettings);

    if (accountData.status === 204) {
      this.accessChild('Export');
      this.setState({ accountData, isLoading: false });
      this.fetchAccountData();
      NotificationManager.success({
        message: <Trans>Settings saved.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
    } else {
      this.setState({ accountData: false, isLoading: false });
      NotificationManager.danger({
        message: (
          <Trans>Settings failed to save.</Trans>
        ),
        options: { lifetime: 3000, isOpen: true },
      });
    }
  }

  private async fetchAccountData() {
    const { currentSession } = this.props;
    const portalName = currentSession.portal && currentSession.portal.title;
    const accountData = await portalService.fetchIntegrationConfiguration(portalName, 'oracle');
    this.setState({ accountData, isLoading: false });
    if (accountData) {
      this.accessChild('Export');
    }
  }
}

export default withAuth(withIntegrations(Oracle, { active: SIDEBAR_MENUS.ORACLE }));
