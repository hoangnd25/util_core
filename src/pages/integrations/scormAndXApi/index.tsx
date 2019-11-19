import * as React from 'react';
import { Spinner, Text, View, ButtonFilled, ButtonMinimal, foundations } from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import { defineMessagesList } from '@src/utils/translation';
import DataFeedService from '@src/services/dataFeed';
import ScormService from '@src/services/scormService';
import withAuth from '@src/components/common/WithAuth';
import SidebarMenus from '@src/components/SidebarMenus';
import Integrations from '@src/pages/integrations';

export const dataFeedService = DataFeedService();
export const scormService = ScormService();

export class ScormAndXapi extends Integrations {
  constructor(props) {
    super(props);
  }

  state = {
    isLoading: true,
    isProcessing: false,
    appID: null,
  };

  componentDidMount() {
    this.fetchApplicationId();
  }

  getPageTitle() {
    const { intl } = this.props;
    return intl.formatMessage(defineMessagesList().integrationScormAndXApiTitle);
  }

  renderSidebar() {
    const { intl } = this.props;
    const sidebarMenus = this.getSidebarMenus(intl);
    const sidebarTitle = intl.formatMessage(defineMessagesList().integrationSidebarTitle);

    return (
      <>
        <View marginBottom={3}>
          <Text element="h3" fontWeight="semibold" fontSize={3}>{sidebarTitle}</Text>
        </View>

        <SidebarMenus
          active="sidebar.integrations-scorm"
          menus={sidebarMenus}
        />
      </>
    );
  }

  renderBody() {
    const { isLoading, isProcessing, appID } = this.state;

    if (isLoading) {
      return (
        <Spinner size={3} />
      );
    }

    return (
      <View minHeight="60vh">
        <View marginBottom={4}>
          <Text element="h3" fontSize={4} fontWeight="semibold">
            <FormattedMessage id="integrationScormAndXApi.applicationID" defaultMessage="Application ID" />
          </Text>
        </View>

        {appID && (
          <View data-testid="scormAndXApi.hasApplicationID">
            <View marginBottom={6}>
              <Text>
                <FormattedMessage id="integrationScormAndXApi.hasApplicationIDDesc" defaultMessage="This application ID can be used as a SCORM or xAPI provider. You can now download your content in SCORM or xAPI format from the Publish / Sharing menu found in the Settings section of each piece of training." />
              </Text>
            </View>

            <View marginBottom={6}>
              <Text fontWeight="semibold" marginBottom={3}>
                <FormattedMessage id="integrationScormAndXApi.applicationID" defaultMessage="Application ID" />
              </Text>

              <View
                backgroundColor="background"
                minHeight="48"
                borderColor="faded"
                border={1}
                paddingX={4}
                flexGrow={1}
                flexShrink={1}
                css={{
                  borderRadius: foundations.spacing[2],

                  [foundations.breakpoints.md]: {
                    maxWidth: "60%",
                  },
                }}
              >
                <Text
                  fontSize={3}
                  css={{
                    lineHeight: "46px",
                    overflow: "hidden",
                    position: "relative",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    top: 0,
                  }}
                >{appID}</Text>
              </View>
            </View>

            <View flexDirection="row">
              <ButtonMinimal size="lg" color="danger" onClick={() => this.updateApplicationId(true)} disabled={isProcessing}>
                <FormattedMessage id="integrationScormAndXApi.removeApplicationID" defaultMessage="Remove Application ID" />
              </ButtonMinimal>
            </View>
          </View>
        )}

        {!appID && (
          <View data-testid="scormAndXApi.noApplicationID">
            <View marginBottom={6}>
              <Text>
                <FormattedMessage id="integrationScormAndXApi.noApplicationIDDesc" defaultMessage="You are one click away from having the ability to export training as SCORM and xAPI enabled on your portal." />
              </Text>
              <Text>
                <FormattedMessage id="integrationScormAndXApi.noApplicationIDGenerateAction" defaultMessage="Click Generate Application ID button below to create an application ID." />
              </Text>
            </View>

            <View flexDirection="row">
              <ButtonFilled size="lg" color="accent" onClick={() => this.updateApplicationId()} disabled={isProcessing}>
                <FormattedMessage id="integrationScormAndXApi.generateApplicationID" defaultMessage="Generate Application ID" />
              </ButtonFilled>
            </View>
          </View>
        )}
      </View>
    );
  }

  private async fetchApplicationId() {
    const { currentSession } = this.props;
    const appID = await scormService.getApplicationId(currentSession.portal.title);

    this.setState({ appID, isLoading: false });
  }

  private async updateApplicationId(isDeleted = false) {
    const { currentSession } = this.props;
    this.setState({ isProcessing: true });

    const appID = await scormService[isDeleted ? 'removeApplicationId' : 'createApplicationId'](currentSession.portal.title);
    this.setState({ appID, isProcessing: false });
  }
}

export default injectIntl(withAuth(ScormAndXapi));
