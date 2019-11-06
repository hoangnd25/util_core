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
  Select,
  Banner,
  SelectDropdown,
  Skeleton,
  NotificationManager,
} from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import csvParser from 'papaparse';
import { defineMessagesList } from '../../utils/translation';
import DataFeedService, { CsvData, CreateMappingPayload } from '../../services/dataFeed';
import { AWSCredential, MappingField, MappingData } from '../../types/userDataFeed';
import AWSConnectionDetail from '../awsConnectionDetail';

interface CSVField {
  value: string;
  label: string;
}

interface Props {
  intl: any;
  currentSession: any;
  isEditing: boolean;
  defaultStep: MappingStep;
  awsCredential: AWSCredential;
  mappingData: MappingData;
  scrollToTop: () => void;
  onCancel: () => void;
  onDone: () => void;
}

interface State {
  touched: boolean;
  submitted: boolean;
  isShowUploader: boolean;
  isUploadingFailed: boolean;
  isUploading: boolean;
  uploadError: string;

  step: MappingStep;
  csvData: CsvData;
  csvFields: CSVField[];
  go1Fields: MappingField[];
  showOptionalFields: boolean;
  mappingError: string;
  awsCredential: AWSCredential;
}

export enum MappingStep {
  Upload = 1,
  Mapping = 2,
  Finish = 3,
}

export const dataFeedService = DataFeedService();

class DataFeedUploadState extends React.Component<Props, State> {
  state = {
    touched: false,
    submitted: false,
    isShowUploader: true,
    isUploadingFailed: false,
    isUploading: false,
    uploadError: null,

    csvData: [],
    csvFields: [],
    go1Fields: [],
    step: MappingStep.Upload,
    showOptionalFields: false,
    mappingError: null,
    awsCredential: null,
  };

  componentDidMount() {
    const { currentSession, defaultStep } = this.props;

    if (defaultStep) {
      this.setState({ step: defaultStep });
    }

    dataFeedService.fetchMappingFields(currentSession.portal.id)
      .then(go1Fields => this.setState({ go1Fields }));
  }

  onParseFile(file: File) {
    this.setState({
      isShowUploader: false,
      isUploading: true,
      isUploadingFailed: false,
      uploadError: null,
    });

    const options = {
      complete: results => {
        if (results.errors.length > 0) {
          this.setState({
            isUploading: false,
            isUploadingFailed: true,
          });
        } else {
          this.setState({
            isUploading: false,
            csvData: results.data,
            step: MappingStep.Mapping,
          });
        }
      },
    };
    csvParser.parse(file, options);
  }

  onReject(file: File) {
    if (file.type !== 'text/csv') {
      const uploadError = this.props.intl.formatMessage(defineMessagesList().dataFeedUploadBlockErrorTextFileExtension, { fileName: file.name });
      this.setState({ uploadError });
    }
  }

  onMapField(mapField: MappingField, csvField: string) {
    const { go1Fields } = this.state;
    const go1FieldsMapped = go1Fields.map(field => {
      if (field.name === mapField.name) {
        field.mappedField = csvField;
      }

      return field;
    });

    this.setState({
      touched: true,
      go1Fields: go1FieldsMapped,
    });
  }

  onMappingDone() {
    this.setState({ submitted: true });
    if (this.validate()) {
      const { isEditing, scrollToTop, currentSession, awsCredential: awsCredentialProp } = this.props;
      const portalId = currentSession.portal && currentSession.portal.id;
      const payload: CreateMappingPayload = {
        type: 'account',
        mappings: this.mapFields(),
        rows: this.state.csvData.slice(0, 5), // get Header & 5 first records
      };

      return dataFeedService.createMapping(payload, portalId)
        .then(() => awsCredentialProp ? Promise.resolve(awsCredentialProp) : dataFeedService.createAWSCredentials(portalId))
        .then((awsCredential: AWSCredential) => {
          if (isEditing) {
            this.setState({ awsCredential, touched: false });

            NotificationManager.success({
              message: <View justifyContent="flex-start"><FormattedMessage id="dataFeed.mapping.successfully" defaultMessage="Update data mapping successfully." /></View>,
              options: { lifetime: 3000, isOpen: true },
            });
          } else {
            this.setState({ awsCredential, step: MappingStep.Finish });
          }
        })
        .catch(mappingResult => {
          const { data } = mappingResult.response || {};
          const mappingError = data && data.errors
            ? data.errors[0].title
            : this.props.intl.formatMessage(defineMessagesList().userDataFeedMappingFailedError);

          this.setState({ isUploadingFailed: true, mappingError });
          scrollToTop();
        });
    }
  }

  renderSkeleton() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(skeOrder => {
      return (
        <View flexDirection="row" flexWrap="wrap" borderColor="soft" borderTop={skeOrder === 1 ? 0 : 1} paddingY={3} key={`mapping-skeleton-${skeOrder}`}>
          <View width={[1/2, 1/2, 1/2]}>
            <Skeleton backgroundColor="faint" maxWidth="60%" borderRadius={2} height={foundations.spacing[6]} />
          </View>

          <View width={[1/2, 1/2, 1/2]}>
            <Skeleton backgroundColor="faint" maxWidth="60%" borderRadius={2} height={foundations.spacing[6]} />
          </View>
        </View>
      );
    });
  }

  renderField(go1Field: MappingField) {
    const { csvFields: csvFieldsState, csvData, submitted } = this.state;
    const skipOptionLabel = this.props.intl.formatMessage(defineMessagesList().userDataFeedMappingSkipField);
    const selectFieldPlaceholder = this.props.intl.formatMessage(defineMessagesList().userDataFeedMappingSelectFieldPlaceholder);
    const skipOptions = [{ value: '', label: skipOptionLabel }];
    const csvFields = csvFieldsState.length > 0 ? csvFieldsState : this.getMappedFields(csvData[0]);

    if (csvFields.length > 0 && csvFieldsState.length === 0) {
      this.setState({ csvFields });
    }

    return (
      <View flexDirection="row" flexWrap="wrap" borderColor="soft" borderBottom={1} paddingY={3}>
        <View width={[1/2, 1/2, 1/2]}>
          <View alignItems="center" flexDirection="row" flexShrink={1} flexGrow={1}>
            <Text fontSize={2} textTransform="capitalize">{go1Field.label}</Text>

            <Text color="subtle" fontSize={1} marginLeft={3}>
              {go1Field.required && (
                <>
                  <View
                    css={{
                      [foundations.breakpoints.sm]: { display: "none" },
                    }}
                  >
                    <FormattedMessage id="userDataFeed.block.mapping.requiredLabel" defaultMessage="Required"/>
                  </View>

                  <View css={{
                    [foundations.breakpoints.md]: { display: "none" },
                  }}>*</View>
                </>
              )}

              {!go1Field.required && (
                <View css={{
                  [foundations.breakpoints.sm]: { display: "none" },
                }}>
                  <FormattedMessage id="userDataFeed.block.mapping.optionalLabel" defaultMessage="Optional"/>
                </View>
              )}
            </Text>
          </View>
        </View>

        {/* Mapping action on desktop */}
        <View
          width={[1/2, 1/2, 1/2]}
          display="none"
          css={{
            [foundations.breakpoints.md]: { display: "flex" },
          }}
        >
          <View maxWidth="220">
            <Select
              options={go1Field.required ? csvFields : skipOptions.concat(csvFields)}
              placeholder={selectFieldPlaceholder}
              defaultValue={go1Field.mappedField}
              value={go1Field.mappedField}
              onChange={({ target }) => this.onMapField(go1Field, target.value)}
            />
          </View>

          {submitted && go1Field.required && !go1Field.mappedField && (
            <Text color="danger" fontSize={1} marginTop={3}>
              <FormattedMessage id="userDataFeed.block.mapping.requiredErrorMessage" defaultMessage="This field is required"/>
            </Text>
          )}
        </View>

        {/* Mapping action on mobile */}
        <View
          width={[1/2, 1/2, 1/2]}
          css={{
            [foundations.breakpoints.md]: { display: "none" },
          }}
        >
          <SelectDropdown
            optionRenderer={null}
            closeOnSelection={true}
            value={go1Field.mappedField}
            options={go1Field.required ? csvFields : skipOptions.concat(csvFields)}
            onChange={({ target }) => this.onMapField(go1Field, target.value)}
           >
            {({ ref, getToggleButtonProps }) => (
              <ButtonFilled
                {...getToggleButtonProps()}
                innerRef={ref}
                justifyContent="flex-start"
              >
                <View flexDirection="row" alignItems="center">
                  {go1Field.mappedField && <Icon name="Check" marginRight={3} />}
                  <Text
                    flexShrink={1}
                    flexGrow={1}
                    fontWeight="normal"
                    css={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {go1Field.mappedField || (
                      <Text><FormattedMessage id="userDataFeed.block.mapping.mapWith" defaultMessage="Map with"/>...</Text>
                    )}
                  </Text>
                </View>
              </ButtonFilled>
            )}
           </SelectDropdown>
        </View>

        {submitted && go1Field.required && !go1Field.mappedField && (
          <View
            width="100%"
            flexDirection="row"
            justifyContent="flex-end"
            marginTop={2}
            css={{
              [foundations.breakpoints.md]: { display: "none" },
            }}
          >
            <Text color="danger" fontSize={1} marginTop={3}>
              <FormattedMessage id="userDataFeed.block.mapping.requiredErrorMessage" defaultMessage="This field is required"/>
            </Text>
          </View>
        )}
      </View>
    );
  }

  render() {
    const {
      step,
      touched,
      isShowUploader,
      isUploading,
      isUploadingFailed,
      uploadError,
      awsCredential,
      go1Fields,
      showOptionalFields,
      mappingError,
    } = this.state;
    const { isEditing, onDone, onCancel } = this.props;

    if (step === MappingStep.Finish) {
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

    if (step === MappingStep.Mapping) {
      const optionalFieldsCount = go1Fields.filter(field => !field.required).length;

      return (
        <>
          {isEditing && (
            <View
              color="subtle"
              alignItems="center"
              flexDirection="row"
              marginBottom={4}
              onClick={() => onCancel()}
              css={{
                cursor: "pointer",

                ":hover": {
                  color: foundations.colors.default,
                }
              }}
            >
              <Icon name="ChevronLeft" />
              <Text fontSize={2} marginLeft={3}>
                <FormattedMessage id="userDataFeed.block.mapping.edit.yourDataFeed" defaultMessage="Your data feed"/>
              </Text>
            </View>
          )}

          <Text fontWeight="semibold" fontSize={4} marginBottom={3}>
            {!isEditing && <FormattedMessage id="userDataFeed.block.mapping.title" defaultMessage="Create mapping rules"/>}
            {isEditing && <FormattedMessage id="userDataFeed.block.mapping.editingTitle" defaultMessage="Data mapping details"/>}
          </Text>
          <Text marginTop={2}>
            {!isEditing && <FormattedMessage id="userDataFeed.block.mapping.subTitle" defaultMessage="Map the fields in your CSV file to the portal fields"/>}
            {isEditing && <FormattedMessage id="userDataFeed.block.mapping.editingSubTitle" defaultMessage="You can edit your current mapping rules"/>}
          </Text>

          {go1Fields.length > 0 && (
            <>
              <View width="100%" marginTop={6}>
                {mappingError && (
                  <Banner type="danger" marginBottom={6}>
                    <Text css={{ whiteSpace: "pre-line" }}>{mappingError}</Text>
                  </Banner>
                )}

                <View flexDirection="row" flexWrap="wrap" marginBottom={4}>
                  <View width={[5/6, 1/2, 1/2]}>
                    <Text fontSize={2} fontWeight="semibold" textTransform="uppercase" color="subtle">
                      <FormattedMessage id="userDataFeed.block.mapping.go1Fields" defaultMessage="GO1 fields"/>
                    </Text>
                  </View>

                  <View width={[1/6, 1/2, 1/2]}>
                    <Text
                      fontSize={2}
                      fontWeight="semibold"
                      textTransform="uppercase"
                      color="subtle"
                      css={{
                        [foundations.breakpoints.sm]: {
                          display: "none",
                        }
                      }}
                    >
                      <FormattedMessage id="userDataFeed.block.mapping.csvFields" defaultMessage="CSV fields"/>
                    </Text>
                  </View>
                </View>

                {go1Fields.filter(field => field.required).map(requiredField => {
                  return (
                    <>
                      {this.renderField(requiredField)}
                    </>
                  );
                })}

                {optionalFieldsCount > 0 && (
                  <>
                    {showOptionalFields && go1Fields.filter(field => !field.required).map(optionalField => {
                      return (
                        <>
                          {this.renderField(optionalField)}
                        </>
                      );
                    })}

                    <View
                      color="subtle"
                      alignItems="center"
                      flexDirection="row"
                      marginTop={5}
                      onClick={() => this.setState({ showOptionalFields: !showOptionalFields })}
                      css={{
                        cursor: "pointer",

                        ":hover": {
                          color: foundations.colors.default,
                        }
                      }}
                    >
                      <Icon name={ showOptionalFields ? 'ChevronUp' : 'ChevronDown'} />
                      <Text fontSize={2} marginLeft={3}>
                        {!showOptionalFields && <FormattedMessage id="userDataFeed.block.mapping.showOptionalFields" defaultMessage="Show all optional fields"/>}
                        {showOptionalFields && <FormattedMessage id="userDataFeed.block.mapping.hideOptionalFields" defaultMessage="Hide all optional fields"/>}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View flexDirection="row" justifyContent={isEditing ? "flex-end" : "space-between"} width="100%" marginTop={7}>
                {!isEditing && (
                  <ButtonFilled size="lg" onClick={() => onCancel()}>
                    <FormattedMessage id="userDataFeed.block.mapping.button.cancel" defaultMessage="Cancel"/>
                  </ButtonFilled>
                )}

                {!isEditing && (
                  <ButtonFilled color="accent" size="lg" onClick={() => this.onMappingDone()}>
                    <FormattedMessage id="userDataFeed.block.mapping.button.next" defaultMessage="Next" />}
                  </ButtonFilled>
                )}

                {isEditing && !touched && (
                  <ButtonFilled color="accent" size="lg" onClick={() => onCancel()}>
                    <FormattedMessage id="userDataFeed.block.mapping.button.done" defaultMessage="Done" />
                  </ButtonFilled>
                )}

                {isEditing && touched && (
                  <ButtonFilled color="accent" size="lg" onClick={() => this.onMappingDone()}>
                    <FormattedMessage id="userDataFeed.block.mapping.button.update" defaultMessage="Update" />
                  </ButtonFilled>
                )}
              </View>
            </>
          )}

          {go1Fields.length === 0 && (
            <View width="100%" marginTop={6}>
              {this.renderSkeleton()}
            </View>
          )}
        </>
      );
    }

    return (
      <>
        <Text fontWeight="semibold" fontSize={4} marginBottom={3}>
          <FormattedMessage id="data.feed.upload.block.title" defaultMessage="Select file"/>
        </Text>
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
                  css={{ cursor: "pointer" }}
                >
                  <View
                    color="subtle"
                    flexDirection="row"
                    alignItems="center"
                    flexShrink={1}
                    flexGrow={1}
                    paddingX={4}
                  >
                    <Icon name="Interactive" marginRight={3} />

                    <Text
                      flexShrink={1}
                      flexGrow={1}
                      css={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {
                        isDragActive
                          ? <FormattedMessage id="data.feed.upload.block.uploader.dragging" defaultMessage="Drop it here"/>
                          : <FormattedMessage id="data.feed.upload.block.uploader.drag" defaultMessage="Drag and drop to upload"/>
                      }
                    </Text>
                  </View>

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
                    onClick={() => this.setState({ isShowUploader: true, uploadError: null })}
                  >
                    <FormattedMessage id="data.feed.upload.block.upload.retry" defaultMessage="Retry"/>
                  </Button>
                </View>
              )}
            </View>
          )}

          {uploadError && (
            <Text marginTop={2} color="danger">{uploadError}</Text>
          )}
        </View>

        <View flexDirection="row" justifyContent="flex-start" width="100%" marginTop={7}>
          <ButtonFilled size="lg" onClick={() => onCancel()}>
            <FormattedMessage id="data.feed.upload.block.cancel.button" defaultMessage="Cancel"/>
          </ButtonFilled>
        </View>
      </>
    );
  }

  private validate() {
    const { go1Fields } = this.state;
    const invalidFields = go1Fields.filter(field => field.required && !field.mappedField);

    return invalidFields.length === 0;
  }

  private mapFields() {
    let mappedFields = {};
    const { go1Fields } = this.state;

    go1Fields.forEach(go1Field => {
      mappedFields[go1Field.name] = go1Field.mappedField || '';
    });

    return mappedFields;
  }

  private getMappedFields(csvHeader: string[]) {
    if (csvHeader && csvHeader.length > 0) {
      return csvHeader
        .filter(fieldName => !!fieldName)
        .map(fieldName => {
          return {
            value: fieldName,
            label: fieldName,
          };
        });
    }

    const { go1Fields } = this.state;
    return go1Fields
      .filter(field => !!field.mappedField)
      .map(field => {
        return {
          value: field.mappedField,
          label: field.mappedField,
        };
      });
  }
}

export default injectIntl(DataFeedUploadState);
