import * as React from 'react';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { Spinner, Text, View } from '@go1d/go1d';
import IconEdit from '@go1d/go1d/build/components/Icons/Edit';
import { SIDEBAR_MENUS_INTEGRATIONS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import AWSConnectionDetail from '@src/components/AwsConnectionDetail';
import DataFeedEmptyState from '@src/components/DataFeed/emptyState';
import DataFeedUploadState, { MappingStep } from '@src/components/DataFeed/uploadState';
import DataFeedService, { AWSCredential, MappingData } from '@src/services/dataFeed';
import withI18n from '@src/components/common/WithI18n';
import { I18n } from '@lingui/core';
import withApiom from '@src/components/common/WithApiom';

export const dataFeedService = DataFeedService();

enum DataFeedState {
  Empty = 1,
  Upload = 2,
}

interface Props {
  currentSession: any;
  i18n: I18n;
}

interface State {
  step: number;
  isLoading: boolean;
  isEditing: boolean;
  awsCredential: AWSCredential;
  mappingData: MappingData;
}

export class UserDataFeed extends React.Component<Props, State> {
  state = {
    step: DataFeedState.Empty,
    isLoading: true,
    isEditing: false,
    awsCredential: null,
    mappingData: null,
  };

  componentDidMount() {
    const { currentSession } = this.props;
    this.fetchData(currentSession.portal.id);
  }

  render() {
    const { currentSession, i18n } = this.props;
    const { step, isLoading, isEditing, awsCredential, mappingData } = this.state;

    if (isLoading) {
      return (
        <View minHeight="60vh" justifyContent="center" alignItems="center">
          <Spinner size={3} />
        </View>
      );
    }

    if (!isEditing && (awsCredential || mappingData)) {
      return (
        <View minHeight="60vh">
          <View marginBottom={5}>
            <Text element="h3" fontSize={4} fontWeight="semibold">
              <Trans>Your data feed</Trans>
            </Text>
          </View>

          {awsCredential && (
            <AWSConnectionDetail
              backgroundColor="faint"
              expandable={true}
              awsCredential={awsCredential}
            />
          )}

          {mappingData && (
            <View
              alignItems="center"
              backgroundColor="faint"
              borderColor="soft"
              flexDirection="row"
              borderRadius={2}
              border={1}
              padding={4}
              paddingRight={5}
              marginTop={5}
              css={{ cursor: "pointer" }}
              onClick={() => this.setState({step: DataFeedState.Upload, isEditing: true})}
            >
              <View flexGrow={1} flexShrink={1}>
                <Text fontWeight="semibold" fontSize={3}>
                  <Trans>Data Mapping</Trans>
                </Text>

                {(mappingData.updated || mappingData.author) && (
                  <Text color="subtle" fontWeight="semibold" marginTop={2}>
                    {mappingData.updated ? dayjs(mappingData.updated).format('DD MMM YYYY') : null} ⋅ {mappingData.author ? mappingData.author.fullName : null}
                  </Text>
                )}
              </View>

              <IconEdit color="subtle" />
            </View>
          )}
        </View>
      );
    }

    return (
      <View minHeight="60vh">
        {step === DataFeedState.Empty && (
          <DataFeedEmptyState i18n={i18n} onStart={() => this.setState({step: DataFeedState.Upload})} />
        )}

        {step === DataFeedState.Upload && (
          <DataFeedUploadState
            i18n={i18n}
            currentSession={currentSession}
            isEditing={isEditing}
            awsCredential={awsCredential}
            mappingData={mappingData}
            defaultStep={isEditing ? MappingStep.Mapping : undefined}
            onDone={() => this.fetchData(currentSession.portal.id)}
            onCancel={() => this.setState({step: DataFeedState.Empty, isEditing: false})}
            scrollToTop={() => console.log()} // this.props.scrollToTop()
          />
        )}
      </View>
    );
  }

  private async fetchData(portalId: number) {
    const awsCredential = await dataFeedService.fetchAWSCredentials(portalId);
    const mappingData = await dataFeedService.fetchMappingData(portalId);

    this.setState({
      isLoading: false,
      awsCredential,
      mappingData,
    })
  }
}

export default withI18n(withAuth(withApiom(UserDataFeed, { active: SIDEBAR_MENUS_INTEGRATIONS.USER_DATA_FEED, menuType: "Integrations" })));
