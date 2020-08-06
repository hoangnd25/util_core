import * as React from 'react';
import moment from 'moment';
import { Trans } from '@lingui/macro';
import {
  Text,
  View,
  ButtonFilled,
  Link,
  NotificationManager,
  LineProgress,
} from '@go1d/go1d';
import IconExport from '@go1d/go1d/build/components/Icons/Export';
import { GO1Portal } from '@src/types/user';
import ContentDistributorService from '@src/services/contentDistributorService';

export const contentDistributorService = ContentDistributorService();

interface Props {
  isConnected: boolean;
  exportType: string;
  portal: GO1Portal;
}

interface State {
  isLoading: boolean;
  customContentCollection: any;
  exportStatus: any;
}

export class ContentDistributorExport extends React.Component<Props, State> {
  state = {
    isLoading: true,
    customContentCollection: null,
    exportStatus: null,
  };

  async componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) {
      const customContentCollection = await this.fetchContentSelection();
      this.getContentDistributorStatus();
      this.setState({
        customContentCollection, 
        isLoading: false 
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  sentenceCase(status) {
    return status.toLowerCase().replace(/(^\s*\w|[.!-]\s*\w)/g, c => c.toUpperCase());
  }

  render() {
    const { isLoading, customContentCollection, exportStatus } = this.state;
    const { isConnected } = this.props;

    if (isLoading) {
      return (<View paddingY={[5, 6]}>
        <View backgroundColor="soft" height="22px" width="30%" marginBottom={5} />
        <View backgroundColor="soft" height="15px" width="75%" marginY={2} />
        <View backgroundColor="soft" height="15px" width="75%" marginY={2} />
        <View backgroundColor="soft" height="44px" width="110px" marginTop={6} borderRadius={2} />
      </View>)
    }

    return (
      <View>
        <Text paddingY={[5, 6]} fontWeight="bold" fontSize={2}>
          <Trans>New Export</Trans>
        </Text>
        <View paddingBottom={6}>
          {!isConnected && (
            <View>
              <Text color="subtle"><Trans>Integration not connected. Check your account settings.</Trans></Text>
            </View>
          )}
          {customContentCollection && customContentCollection.custom !== 0 && (
            <View>
              <Text color="subtle">
                <Trans>Resources to be exported</Trans>
              </Text>
              <Text fontWeight="semibold" fontSize={3}>
                {customContentCollection.custom}
              </Text>
            </View>
          )}

          {customContentCollection && customContentCollection.custom === 0 && (
            <View flexDirection={['column', 'row']}>
              <Text color="subtle"><Trans>No content added to custom selection for export.</Trans>&nbsp;</Text>
              <Link href="/p/#/app/custom-content-selection">
                <Text paddingLeft={[0, 2]} paddingTop={[2, 0]} color="accent">
                  <Trans>Add more content to selection.</Trans>
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
              onClick={this.contentDistributorExport}
            >
              <Trans>Export</Trans>
            </ButtonFilled>

            <View flexDirection={['column', 'row']} alignItems={['flex-start', 'center']}>
              <Text color="subtle"><Trans>Want more content?</Trans>&nbsp;</Text>
              <Link href="/p/#/app/custom-content-selection">
                <Text paddingLeft={[0, 2]} paddingTop={[2, 0]} color="accent">
                  <Trans>Add them in the custom selection.</Trans>
                </Text>
              </Link>
            </View>
          </View>
        )}
        {exportStatus && (
          <View>
            <Text paddingTop={[6, 7]} paddingY={[5, 6]} fontWeight="bold" fontSize={2}>
              <Trans>Last Export</Trans>
            </Text>

            <View flexDirection={['column', 'row']} width="100%" marginBottom={[0, 6]}>
              <View width={['100%', '50%']}>
                <Text color="subtle"><Trans>Requested</Trans></Text>
                <Text fontWeight="semibold">
                  {exportStatus.timestamp && moment(exportStatus.timestamp).format('MMMM Do, YYYY h:mma')}
                </Text>
              </View>

              <View
                paddingY={[4, 0]}
                paddingLeft={[0, 4]}
                borderLeft={[0, 2]}
                borderColor="soft"
                width={['100%', '50%']}
              >
                <Text color="subtle"><Trans>Status</Trans></Text>
                {(exportStatus.status !== 'in-progress' || exportStatus.done === exportStatus.total) ? (
                  <Text fontWeight="semibold">
                    {exportStatus.status && this.sentenceCase(exportStatus.status)}
                  </Text>
                ) : (
                  <View marginY={4}>
                    <LineProgress percent={(exportStatus.done / exportStatus.total) * 100} />
                  </View>
                )}
              </View>
            </View>

            <View flexDirection={['column', 'row']} width="100%">
              <View width={['100%', '50%']}>
                <Text color="subtle"><Trans>Resources exported</Trans></Text>
                <Text fontWeight="semibold">
                  {exportStatus.done}
                </Text>
              </View>
              <View
                paddingY={[4, 0]}
                paddingLeft={[0, 4]}
                borderLeft={[0, 2]}
                borderColor="soft"
                width={['100%', '50%']}
              >
                <Text color="subtle"><Trans>Errors within export</Trans></Text>
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

  private fetchContentSelection() {
    const { portal: { id } } = this.props;
    return contentDistributorService.getCustomContent(parseInt(id));
  }

  private async getContentDistributorStatus() {
    const { portal: { id } } = this.props;
    const exportStatus = await contentDistributorService.getExportStatus(parseInt(id));
    if (exportStatus && exportStatus.status !== 'completed') {
      setTimeout(() => {
        this.getContentDistributorStatus();
      }, 10000);
    }
    if (!exportStatus) {
      this.setState({ exportStatus: false });
    } else this.setState({ exportStatus });
  }

  private contentDistributorExport = async () => {
    const { exportType, portal } = this.props;
    const { status } = await contentDistributorService.exportContent(parseInt(portal.id), exportType);
    if (status) {
      NotificationManager.success({
        message: <Trans>Export requested.</Trans>,
        options: { lifetime: 3000, isOpen: true },
      });
      this.getContentDistributorStatus();
    } else {
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
