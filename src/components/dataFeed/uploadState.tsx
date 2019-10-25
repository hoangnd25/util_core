import * as React from 'react';
import {
  View,
  Text,
  EmptyState,
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

interface Props {
  onCancel: (step: number) => void;
  intl: any,
  currentSession: any,
}

interface State {
  isShowUploader: boolean;
  isUploadingFailed: boolean;
  isUploading: boolean;
  errorMess: string | null;
}

const dataFeedService = DataFeedService();

class DataFeedUploadState extends React.Component<Props, State> {
  state = {
    isShowUploader: true,
    isUploadingFailed: false,
    isUploading: false,
    errorMess: null,
  };

  public onParseFile(file: File) {
    this.setState({ isShowUploader: false, isUploading: true, isUploadingFailed: false, errorMess: null });
    const options = {
      complete: results => {
        console.log(results);
        if (results.errors.length > 0) {
          this.setState({ isUploading: false, isUploadingFailed: true });
        } else {
          this.onParseCsvDone(results.data);
        }
      },
    };
    csvParser.parse(file, options)
  }

  /**
   * Temporary logic for fixed fields, fixed csv file, will change when implement mapping screen
   */
  public onParseCsvDone(csvData: any) {
    const { currentSession } = this.props;
    let mappedFields = {};
    const headers = csvData[0];
    fixedPortalFields.forEach(portalField => {
      const csvField = headers.find(field => field === portalField);
      if (csvField) {
        mappedFields = dataFeedService.doMapping(portalField, csvField, mappedFields);
      }
    });
    const rows: CsvData = dataFeedService.getRows(mappedFields, csvData);
    const payload: CreateMappingPayload = {
      type: 'account',
      mappings: mappedFields,
      rows,
    };
    dataFeedService.createMapping(payload, currentSession.portal.id)
      .then(() => this.setState({ isUploading: false, isShowUploader: true }))
      .catch(() => this.setState({ isUploading: false, isUploadingFailed: true }));
  }

  public onReject(file: File) {
    const { intl } = this.props;
    if (file.type !== 'text/csv') {
      this.setState({ errorMess: intl.formatMessage(defineMessagesList().dataFeedUploadBlockErrorTextFileExtension, { fileName: file.name }) });
    }
  }

  public render() {
    const { isShowUploader, isUploading, isUploadingFailed, errorMess } = this.state;
    const { onCancel } = this.props;

    return (
      <>
        <Text fontWeight="semibold" fontSize={4} marginBottom={4}>Select file</Text>
        <Text marginBottom={5}>
          <FormattedMessage id="data.feed.upload.block.sub.title" defaultMessage="Browse for a CSV file to upload for setting up fields mapping rules."/>
        </Text>
        <View
          border={1}
          borderColor="faded"
          borderRadius={2}
          backgroundColor="faint"
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
        <ButtonFilled onClick={() => onCancel(0)} marginTop={7}>
          <FormattedMessage id="data.feed.upload.block.cancel.button" defaultMessage="Cancel"/>
        </ButtonFilled>
      </>
    );
  }
}

export default injectIntl(DataFeedUploadState);
