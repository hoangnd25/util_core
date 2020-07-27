import * as React from 'react';
import { Trans } from '@lingui/macro';
import { Spinner, Text, View, ButtonFilled, ButtonMinimal, foundations } from '@go1d/go1d';
import { SIDEBAR_MENUS } from '@src/constants';
import ScormService from '@src/services/scormService';
import withAuth from '@src/components/common/WithAuth';
import WithIntegrations from '@src/components/common/WithIntegrations';

export const scormService = ScormService();

interface Props {
  currentSession: any;
}

interface State {
  isLoading: boolean,
  isProcessing: boolean,
  appID: string | null,
}

export class ScormAndXapi extends React.Component<Props, State> {
  state = {
    isLoading: true,
    isProcessing: false,
    appID: null,
  };

  componentDidMount() {
    this.fetchApplicationId();
  }

  render() {
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
            <Trans>Application ID</Trans>
          </Text>
        </View>

        {appID && (
          <View data-testid="scormAndXApi.hasApplicationID">
            <View marginBottom={6}>
              <Text>
                <Trans>This application ID can be used as a SCORM or xAPI provider. You can now download your content in SCORM or xAPI format from the Publish / Sharing menu found in the Settings section of each piece of training.</Trans>
              </Text>
            </View>

            <View marginBottom={6}>
              <Text fontWeight="semibold" marginBottom={3}>
                <Trans>Application ID</Trans>
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
                <Trans>Remove Application ID</Trans>
              </ButtonMinimal>
            </View>
          </View>
        )}

        {!appID && (
          <View data-testid="scormAndXApi.noApplicationID">
            <View marginBottom={6}>
              <Text>
                <Trans>You are one click away from having the ability to export training as SCORM and xAPI enabled on your portal.</Trans>
              </Text>
              <Text>
                <Trans>Click Generate Application ID button below to create an application ID.</Trans>
              </Text>
            </View>

            <View flexDirection="row">
              <ButtonFilled size="lg" color="accent" onClick={() => this.updateApplicationId()} disabled={isProcessing}>
                <Trans>Generate Application ID</Trans>
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

export default withAuth(WithIntegrations(ScormAndXapi, { active: SIDEBAR_MENUS.SCORM_AND_XAPI }));
