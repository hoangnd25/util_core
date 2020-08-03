import * as React from 'react';
import moment from 'moment';
import { Trans } from '@lingui/macro';
import {
  Spinner,
  Text,
  View,
  ButtonFilled,
  Link,
  NotificationManager,
  LineProgress,
} from '@go1d/go1d';
import IconExport from '@go1d/go1d/build/components/Icons/Export';
import { GO1Portal } from '@src/types/user';
import PortalService from '@src/services/portalService';
import ContentDistributorService from '@src/services/contentDistributorService';

export const contentDistributorService = ContentDistributorService();
export const portalService = PortalService();

interface Props {
  targetName: string;
  portal: GO1Portal;
}

interface State {
  isLoading: boolean;
  accountData: any;
  customContentCollection: any;
  exportContent: any;
  exportStatus: any;
}

export class ContentDistributorExport extends React.Component<Props, State> {
  state = {
    isLoading: true,
    accountData: null,
    customContentCollection: null,
    exportContent: null,
    exportStatus: null,
  };

  async componentDidMount() {
    const [accountData, customContentCollection] = await Promise.all([
      this.fetchAccountData(),
      this.fetchContentSelection(),
    ]);

    this.setState({ 
      accountData,
      customContentCollection, 
      isLoading: false 
    });

    this.getContentDistributorStatus();
  }

  timestampToDate(timestamp) {
    return moment(timestamp).format('MMMM Do, YYYY h:mma');
  }

  sentenceCase(status) {
    return status.toLowerCase().replace(/(^\s*\w|[.!-]\s*\w)/g, c => c.toUpperCase());
  }

  render() {
    const { isLoading, accountData, customContentCollection, exportStatus } = this.state;
    const { portal } = this.props;

    if (isLoading) {
      // @TODO replace with skeleton
      return <Spinner size={3} />;
    }

    return (
      <View>
        <Text paddingY={[5, 6]} fontWeight="bold" fontSize={2}>
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
              <Text color="subtle">
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
              onClick={() => this.contentDistributorExport(portal.id)}
            >
              Export
            </ButtonFilled>

            <View flexDirection={['column', 'row']} alignItems={['flex-start', 'center']}>
              <Text color="subtle">Want more content? </Text>
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
            <Text paddingTop={[6, 7]} paddingY={[5, 6]} fontWeight="bold" fontSize={2}>
              Last Export
            </Text>

            <View flexDirection={['column', 'row']} width="100%" marginBottom={[0, 6]}>
              <View width={['100%', '50%']}>
                <Text paddingY={[2, 0]} color="subtle">
                  Requested
                </Text>
                <Text fontWeight="semibold">
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
                  <Text fontWeight="semibold">
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
                <Text fontWeight="semibold">
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
                <Text fontWeight="semibold">
                  {exportStatus.errors && exportStatus.errors.length}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  private fetchAccountData() {
    const { portal, targetName } = this.props;
    const portalName = portal && portal.title;
    return portalService.fetchIntegrationConfiguration(portalName, targetName);
  }

  private fetchContentSelection() {
    const { portal } = this.props;
    const portalId = portal && parseInt(portal.id);
    return contentDistributorService.getCustomContent(portalId);
  }

  private async getContentDistributorStatus() {
    const { portal } = this.props;
    const portalId = portal && parseInt(portal.id);
    const exportStatus = await contentDistributorService.getExportStatus(portalId);
    if (exportStatus && exportStatus.status === 'complete') {
      try {
        setInterval(async () => {
          this.getContentDistributorStatus();
        }, 10000);
      } catch (e) {
        console.log(e);
      }
    }
    if (!exportStatus) {
      this.setState({ exportStatus: false });
    } else this.setState({ exportStatus });
  }

  private async contentDistributorExport(portalId) {
    const { targetName } = this.props;
    const exportContent = await contentDistributorService.exportContent(portalId, targetName);
    if (exportContent.status) {
      this.setState({ exportContent });
      NotificationManager.success({
        message: <Trans>Export requested.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
      this.getContentDistributorStatus();
    } else {
      this.setState({ exportContent: false });
      NotificationManager.danger({
        message: (
          <Trans>Unable to request export.</Trans>
        ),
        options: { lifetime: 3000, isOpen: true },
      });
    }
  }
}

export default ContentDistributorExport;
