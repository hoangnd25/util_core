import * as React from 'react';
import {
  View,
  Text,
  BaseUploader,
  ButtonFilled,
  foundations,
  Button,
  Spinner,
  Icon,
} from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import csvParser from 'papaparse';
import { defineMessagesList } from '../../utils/translation';
import DataFeedService, { fixedPortalFields, CreateMappingPayload, CsvData } from '../../services/dataFeed';
import { AWSCredential } from '../../types/userDataFeed';
import AWSConnectionDetail from '../awsConnectionDetail';

interface Props {
  intl: any,
  currentSession: any,
  onCancel: (step: number) => void;
  onDone: () => void;
}

interface State {
  isShowUploader: boolean;
  isUploadingSucceed: boolean;
  isUploadingFailed: boolean;
  isUploading: boolean;
  errorMess: string | null;
  awsCredential: AWSCredential;
}

export const dataFeedService = DataFeedService();

class DataFeedUploadState extends React.Component<Props, State> {
  state = {
    isShowUploader: true,
    isUploadingSucceed: false,
    isUploadingFailed: false,
    isUploading: false,
    errorMess: null,
    awsCredential: null,
  };

  public onParseFile(file: File) {
    this.setState({
      isShowUploader: false,
      isUploading: true,
      isUploadingSucceed: false,
      isUploadingFailed: false,
      errorMess: null,
    });

    const options = {
      complete: results => {
        if (results.errors.length > 0) {
          this.setState({ isUploading: false, isUploadingFailed: true });
        } else {
          this.onParseCsvDone(results.data);
        }
      },
    };
    csvParser.parse(file, options);
  }

  /**
   * Temporary logic for fixed fields, fixed csv file, will change when implement mapping screen
   */
  public onParseCsvDone(csvData: any) {
    const { currentSession } = this.props;
    const mappedFields = this.createMappedFields(csvData);
    const rows: CsvData = dataFeedService.getRows(mappedFields, csvData);
    const payload: CreateMappingPayload = {
      type: 'account',
      mappings: mappedFields,
      rows,
    };

    dataFeedService.createMapping(payload, currentSession.portal.id)
      .then((awsCredential: AWSCredential) => {
        this.setState({
          isUploading: false,
          isUploadingSucceed: true,
          awsCredential,
        });
      })
      .catch(error => {
        console.log('DataFeedUploadState.Error', error);
        this.setState({
          isUploading: false,
          isUploadingFailed: true,
        });
      });
  }

  private createMappedFields(csvData: CsvData) {
    let mappedFields = {};

    fixedPortalFields.forEach(portalField => {
      const csvField = csvData[0].find(field => field === portalField);
      if (csvField) {
        mappedFields = dataFeedService.doMapping(portalField, csvField, mappedFields);
      }
    });

    return mappedFields;
  }

  public onReject(file: File) {
    const { intl } = this.props;
    if (file.type !== 'text/csv') {
      this.setState({ errorMess: intl.formatMessage(defineMessagesList().dataFeedUploadBlockErrorTextFileExtension, { fileName: file.name }) });
    }
  }

  public render() {
    const {
      isShowUploader,
      isUploading,
      isUploadingSucceed,
      isUploadingFailed,
      errorMess,
      awsCredential,
    } = this.state;
    const { onDone, onCancel } = this.props;

    if (isUploadingSucceed && awsCredential) {
      return (
        <>
          <AWSConnectionDetail awsCredential={awsCredential} />

          <View flexDirection="row" justifyContent="flex-end" width="100%" marginTop={7}>
            <ButtonFilled color="accent" size="lg" onClick={() => onDone()}>
              <FormattedMessage id="data.feed.upload.block.done.button" defaultMessage="Done" />
            </ButtonFilled>
          </View>
        </>
      );
    }

    return (
      <>
        <Text fontWeight="semibold" fontSize={4} marginBottom={3}>Select file</Text>
        <Text marginTop={2}>
          <FormattedMessage id="data.feed.upload.block.sub.title" defaultMessage="Browse for a CSV file to upload for setting up fields mapping rules."/>
        </Text>

        <View
          border={1}
          borderColor="faded"
          borderRadius={2}
          backgroundColor="faint"
          marginTop={6}
          width={[1, 1, 3/5]}
          css={{
            borderWidth: '1px',
            borderStyle: 'solid',
            width: '100%',
            height: foundations.spacing[7],
          }}
        >
          {isShowUploader && (
            <BaseUploader
              fileType=".csv"
              onChange={files => this.onParseFile(files[0])}
              onDropRejected={files => this.onReject(files[0])}
            >
              {({open, getRootProps, isDragActive}) => (
                <View
                  {...getRootProps({refKey: 'innerRef'})}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  height="100%"
                  width="100%"
                >
                  <Button
                    color="subtle"
                    iconName="Interactive"
                  >
                    {isDragActive ? <FormattedMessage id="data.feed.upload.block.uploader.dragging" defaultMessage="Drop it here"/> :  <FormattedMessage id="data.feed.upload.block.uploader.drag" defaultMessage="Drag and drop to upload"/>}
                  </Button>
                  <Button iconName="Upload">
                    <FormattedMessage id="data.feed.upload.block.upload.choose.file" defaultMessage="Choose a file"/>
                  </Button>
                </View>
              )}
            </BaseUploader>
          )}

          {!isShowUploader && (
            <View
              paddingX={3}
              justifyContent="center"
              css={{
                height: '100%',
                width: '100%',
              }}
            >
              {isUploading && (
                <View flexDirection="row">
                  <Spinner marginRight={3} size={3}/>
                  <Text color="subtle"><FormattedMessage id="data.feed.upload.block.uploading" defaultMessage="Uploading"/>...</Text>
                </View>
              )}

              {isUploadingFailed && (
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <View flexDirection="row" alignItems="center">
                    <Icon color="danger" name="NotPassed" marginRight={3} size={3}/>
                    <Text color="danger">
                      <FormattedMessage id="data.feed.upload.block.upload.failed" defaultMessage="Upload failed"/>
                    </Text>
                  </View>
                  <Button
                    color="accent"
                    onClick={() => this.setState({ isShowUploader: true, errorMess: null })}
                  >
                    <FormattedMessage id="data.feed.upload.block.upload.retry" defaultMessage="Retry"/>
                  </Button>
                </View>
              )}
            </View>
          )}

          {errorMess && (
            <Text marginTop={2} color="danger">{errorMess}</Text>
          )}
        </View>

        <View flexDirection="row" justifyContent="flex-start" width="100%" marginTop={7}>
          <ButtonFilled size="lg" onClick={() => onCancel(0)}>
            <FormattedMessage id="data.feed.upload.block.cancel.button" defaultMessage="Cancel"/>
          </ButtonFilled>
        </View>
      </>
    );
  }
}

export default injectIntl(DataFeedUploadState);
