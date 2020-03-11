import * as React from 'react';
import dayjs from 'dayjs';
import { Spinner, Text, View, Icon } from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import DataFeedService from '@src/services/dataFeed';
import { AWSCredential, MappingData } from '@src/types/userDataFeed';
import { defineMessagesList } from '@src/utils/translation';
import withAuth from '@src/components/common/WithAuth';
import withMasterPage, { MasterPageProps } from '@src/pages/masterPage';
import AWSConnectionDetail from '@src/components/awsConnectionDetail';
import DataFeedEmptyState from '@src/components/dataFeed/emptyState';
import DataFeedUploadState, { MappingStep } from '@src/components/dataFeed/uploadState';

export const dataFeedService = DataFeedService();

enum DataFeedState {
  Empty = 1,
  Upload = 2,
}

interface Props extends MasterPageProps{
  currentSession: any;
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

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { currentSession } = this.props;
    this.fetchData(currentSession.portal.id);
  }

  render() {
    const { intl, currentSession } = this.props;
    const { step, isLoading, isEditing, awsCredential, mappingData } = this.state;
    const yourDataFeedTitle = intl.formatMessage(defineMessagesList().integrationUserDataFeedConnectionDetailTitle);

    if (isLoading) {
      return (
        <Spinner size={3} />
      );
    }

    if (!isEditing && (awsCredential || mappingData)) {
      return (
        <View minHeight="60vh">
          <View marginBottom={5}>
            <Text element="h3" fontSize={4} fontWeight="semibold">{yourDataFeedTitle}</Text>
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
                  <FormattedMessage id="userDataFeed.block.mappingData.title" defaultMessage="Data Mapping" />
                </Text>

                {(mappingData.updated || mappingData.author) && (
                  <Text color="subtle" fontWeight="semibold" marginTop={2}>
                    {mappingData.updated ? dayjs(mappingData.updated).format('DD MMM YYYY') : null} ⋅ {mappingData.author ? mappingData.author.fullName : null}
                  </Text>
                )}
              </View>

              <Icon color="subtle" name="Edit" />
            </View>
          )}
        </View>
      );
    }

    return (
      <View minHeight="60vh">
        {step === DataFeedState.Empty && (
          <DataFeedEmptyState onStart={() => this.setState({step: DataFeedState.Upload})} />
        )}

        {step === DataFeedState.Upload && (
          <DataFeedUploadState
            currentSession={currentSession}
            isEditing={isEditing}
            awsCredential={awsCredential}
            mappingData={mappingData}
            defaultStep={isEditing ? MappingStep.Mapping : undefined}
            onDone={() => this.fetchData(currentSession.portal.id)}
            onCancel={() => this.setState({step: DataFeedState.Empty, isEditing: false})}
            scrollToTop={() => this.props.scrollToTop()}
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

export default injectIntl(withAuth(withMasterPage(UserDataFeed, { parentPage: 'integration', childPage: 'user-data-feed' })));
