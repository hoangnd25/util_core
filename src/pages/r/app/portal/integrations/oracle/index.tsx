import * as React from 'react';
import moment from 'moment';
import { Trans } from '@lingui/macro';
import {
  Spinner,
  Text,
  View,
  ButtonFilled,
  Link,
  Form,
  Field,
  TextInput,
  SubmitButton,
  NotificationManager,
  LineProgress,
} from '@go1d/go1d';
import IconCheck from '@go1d/go1d/build/components/Icons/Check';
import IconExport from '@go1d/go1d/build/components/Icons/Export';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import TabMenuNavigation from '@src/components/common/TabMenuNavigation';
import PortalService from '@src/services/portalService';
import ContentDistributorService from '@src/services/contentDistributorService';

export const contentDistributorService = ContentDistributorService();
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
    this.fetchContentSelection();
    this.getContentDistributorStatus();
  }

  accessChild = tab => {
    this.child.current.onClickTabItem(tab);
  };

  timestampToDate(timestamp) {
    return moment(timestamp).format('MMMM Do, YYYY h:mma');
  }

  sentenceCase(status) {
    return status.toLowerCase().replace(/(^\s*\w|[.!-]\s*\w)/g, c => c.toUpperCase());
  }

  render() {
    const { isLoading, accountData, customContentCollection, exportStatus } = this.state;
    const { currentSession } = this.props;

    if (isLoading) {
      return <Spinner size={3} />;
    }

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
            <View>
              <Text paddingY={[5, 6]} fontWeight="semibold" fontSize={3}>
                New Export
              </Text>
              <View paddingBottom={6}>
                {!accountData && (
                  <View>
                    <Text color="subtle">Integration not connected. Check your account settings. </Text>
                  </View>
                )}
                {customContentCollection && customContentCollection.custom !== 0 && (
                  <View>
                    <Text paddingBottom={4} color="subtle">
                      Resources to be exported
                    </Text>
                    <Text fontWeight="semibold" fontSize={3}>
                      {customContentCollection.custom}
                    </Text>
                  </View>
                )}

                {customContentCollection && customContentCollection.custom === 0 && (
                  <View flexDirection={['column', 'row']}>
                    <Text color="subtle">No content added to custom selection for export. </Text>
                    <Link href="/p/#/app/custom-content-selection">
                      <Text paddingLeft={[0, 2]} paddingTop={[2, 0]} color="accent">
                        Add more content to selection.
                      </Text>
                    </Link>
                  </View>
                )}
              </View>

              {customContentCollection && customContentCollection.custom !== 0 && (
                <View flexDirection="column">
                  <ButtonFilled
                    marginBottom={6}
                    icon={IconExport}
                    color="accent"
                    width="fit-content"
                    onClick={() => this.contentDistributorExport(currentSession.portal.id)}
                  >
                    Export
                  </ButtonFilled>

                  <View flexDirection={['column', 'row']} alignItems={['flex-start', 'center']}>
                    <Text>Want more content? </Text>
                    <Link href="/p/#/app/custom-content-selection">
                      <Text paddingLeft={[0, 2]} paddingTop={[2, 0]} color="accent">
                        Add them in the custom selection.
                      </Text>
                    </Link>
                  </View>
                </View>
              )}
              {exportStatus && (
                <View>
                  <Text paddingY={[5, 6]} fontWeight="semibold" fontSize={3}>
                    Last Export
                  </Text>

                  <View flexDirection={['column', 'row']} width="100%" marginBottom={[0, 6]}>
                    <View width={['100%', '50%']}>
                      <Text paddingY={[2, 0]} color="subtle">
                        Requested
                      </Text>

                      <Text fontWeight="semibold" fontSize={3}>
                        {exportStatus.timestamp && this.timestampToDate(exportStatus.timestamp)}
                      </Text>
                    </View>

                    <View
                      paddingY={[4, 0]}
                      paddingLeft={[0, 4]}
                      borderLeft={[0, 2]}
                      borderColor="soft"
                      width={['100%', '50%']}
                    >
                      <Text color="subtle">Status</Text>

                      {exportStatus && exportStatus.status !== 'in-progress' && (
                        <Text fontWeight="semibold" fontSize={3}>
                          {exportStatus.status && this.sentenceCase(exportStatus.status)}
                        </Text>
                      )}

                      {exportStatus && exportStatus.status === 'in-progress' && (
                        <View marginY={4}>
                          <LineProgress percent={(exportStatus.done / exportStatus.total) * 100} />
                        </View>
                      )}
                    </View>
                  </View>

                  <View flexDirection={['column', 'row']} width="100%">
                    <View width={['100%', '50%']}>
                      <Text color="subtle">Resources exported</Text>
                      <Text fontWeight="semibold" fontSize={3}>
                        {exportStatus && exportStatus.done}
                      </Text>
                    </View>
                    <View
                      paddingY={[4, 0]}
                      paddingLeft={[0, 4]}
                      borderLeft={[0, 2]}
                      borderColor="soft"
                      width={['100%', '50%']}
                    >
                      <Text color="subtle">Errors within export</Text>
                      <Text fontWeight="semibold" fontSize={3}>
                        {exportStatus.errors && exportStatus.errors.length}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
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

  private async fetchContentSelection() {
    const { currentSession } = this.props;
    const portalId = currentSession.portal && parseInt(currentSession.portal.id);
    const customContentCollection = await contentDistributorService.getCustomContent(portalId);
    this.setState({ customContentCollection, isLoading: false });
  }

  private async getContentDistributorStatus() {
    const { currentSession } = this.props;
    const portalId = currentSession.portal && parseInt(currentSession.portal.id);
    const exportStatus = await contentDistributorService.getExportStatus(portalId);
    if (exportStatus.status === 'complete') {
      try {
        setInterval(async () => {
          this.getContentDistributorStatus();
        }, 10000);
      } catch (e) {
        console.log(e);
      }
    }
    if (!exportStatus) {
      this.setState({ exportStatus: false, isLoading: false });
    } else this.setState({ exportStatus, isLoading: false });
  }

  private async contentDistributorExport(portalId) {
    const exportContent = await contentDistributorService.exportContent(portalId, 'oracle');
    if (exportContent.status) {
      this.setState({ exportContent, isLoading: false });
      NotificationManager.success({
        message: <Trans>Export requested.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
      this.getContentDistributorStatus();
    } else {
      this.setState({ exportContent: false, isLoading: false });
      NotificationManager.danger({
        message: (
          <Trans>Unable to request export.</Trans>
        ),
        options: { lifetime: 3000, isOpen: true },
      });
    }
  }
}

export default withAuth(withIntegrations(Oracle, { active: SIDEBAR_MENUS.ORACLE }));
