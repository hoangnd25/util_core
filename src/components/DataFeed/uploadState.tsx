import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/core';
import {
  View,
  Text,
  BaseUploader,
  ButtonFilled,
  foundations,
  Button,
  Spinner,
  Select,
  Banner,
  SelectDropdown,
  Skeleton,
  NotificationManager,
  Link,
} from '@go1d/go1d';
import IconCheck from '@go1d/go1d/build/components/Icons/Check';
import IconChevronDown from '@go1d/go1d/build/components/Icons/ChevronDown';
import IconChevronLeft from '@go1d/go1d/build/components/Icons/ChevronLeft';
import IconChevronUp from '@go1d/go1d/build/components/Icons/ChevronUp';
import IconNotPassed from '@go1d/go1d/build/components/Icons/NotPassed';
import IconUpload from '@go1d/go1d/build/components/Icons/Upload';
import csvParser from 'papaparse';
import DataFeedService, { 
  CsvData, 
  CreateMappingPayload, 
  AWSCredential, 
  MappingField, 
  MappingData 
} from '@src/services/dataFeed';
import AWSConnectionDetail from '@src/components/AwsConnectionDetail';
import IconCheckbox from '@go1d/go1d/build/components/Icons/Checkbox';
import IconInteractive from '@go1d/go1d/build/components/Icons/Interactive';

interface CSVField {
  value: string;
  label: string | React.ReactNode;
}

interface Props {
  i18n: I18n;
  currentSession: any;
  isEditing?: boolean;
  defaultStep?: MappingStep;
  awsCredential?: AWSCredential;
  mappingData?: MappingData;
  scrollToTop: () => void;
  onCancel: () => void;
  onDone?: () => void;
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
  externalId: string;
  externalIdFields: CSVField[],
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
    externalId: 'mail',
    externalIdFields: [],
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
      .then(data => this.setState({
        go1Fields: data.go1Fields,
        externalIdFields: this.getAvailableExternalIdFields(data.go1Fields),
        externalId: data.externalId,
      }));
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
    const { i18n } = this.props;
    if (file.type !== 'text/csv') {
      const uploadError = i18n._(t`${file.name} is not a supported file type`);
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

  onMapExternalId(value: string) {
    this.setState({
      touched: true,
      externalId: value,
    });
  }

  onMappingDone() {
    this.setState({ submitted: true });

    if (this.validate()) {
      const { isEditing, scrollToTop, currentSession, awsCredential: awsCredentialProp, i18n } = this.props;
      const { externalId } = this.state;
      const portalId = currentSession.portal && currentSession.portal.id;
      const payload: CreateMappingPayload = {
        type: 'account',
        mappings: this.mapFields(),
        external_id: externalId,
        rows: this.state.csvData.slice(0, 5), // get Header & 5 first records
      };

      return dataFeedService.createMapping(payload, portalId)
        .then(() => {
          if (awsCredentialProp) {
            return awsCredentialProp.awsSecretKey
              ? dataFeedService.createAWSCredentials(portalId, true) // remove SecretKey from an existing connection in database
              : Promise.resolve(awsCredentialProp);
          }

          return dataFeedService.createAWSCredentials(portalId);
        })
        .then((awsCredential: AWSCredential) => {
          if (isEditing) {
            this.setState({ awsCredential, touched: false });

            NotificationManager.success({
              message: <View justifyContent="flex-start"><Trans>Update data mapping successfully."</Trans></View>,
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
            : i18n._(t`Failed to save your mapping, please try again or contact us for assistance`);
          if (mappingError.indexOf('date_value') > -1) {
            this.setState({ uploadError: i18n._(t`Invalid date format. Please edit your file follow this format: YYYY-MM-DD`), step: MappingStep.Upload, isShowUploader: true });
          } else {
            this.setState({ isUploadingFailed: true, mappingError });
          }
          scrollToTop();
        });
    }

    return null;
  }

  renderSkeleton() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(skeOrder => {
      return (
        <View flexDirection="row" flexWrap="wrap" borderColor="soft" borderTop={skeOrder === 1 ? 0 : 1} paddingY={3} key={`mapping-skeleton-${skeOrder}`}>
          <View width={[1 / 2, 1 / 2, 1 / 2]}>
            <Skeleton backgroundColor="faint" maxWidth="60%" borderRadius={2} height={foundations.spacing[6]} />
          </View>

          <View width={[1 / 2, 1 / 2, 1 / 2]}>
            <Skeleton backgroundColor="faint" maxWidth="60%" borderRadius={2} height={foundations.spacing[6]} />
          </View>
        </View>
      );
    });
  }

  renderField(go1Field: MappingField) {
    const { i18n } = this.props;
    const { csvFields: csvFieldsState, csvData, submitted } = this.state;
    const skipOptionLabel = i18n._(t`Skip this field`);
    const selectFieldPlaceholder = i18n._(t`Select a field`);
    const skipOptions = [{ value: '', label: skipOptionLabel }];
    const csvFields = csvFieldsState.length > 0 ? csvFieldsState : this.getMappedFields(csvData[0]);

    if (csvFields.length > 0 && csvFieldsState.length === 0) {
      this.setState({ csvFields });
    }

    return (
      <View flexDirection="row" flexWrap="wrap" borderColor="soft" borderBottom={1} paddingY={3}>
        <View width={[1 / 2, 1 / 2, 1 / 2]}>
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
                    <Trans>Required</Trans>
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
                  <Trans>Optional</Trans>
                </View>
              )}
            </Text>
          </View>
        </View>

        {/* Mapping action on desktop */}
        <View
          width={[1 / 2, 1 / 2, 1 / 2]}
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
              <Trans>This field is required</Trans>
            </Text>
          )}
        </View>

        {/* Mapping action on mobile */}
        <View
          width={[1 / 2, 1 / 2, 1 / 2]}
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
                  {go1Field.mappedField && <IconCheck marginRight={3} />}
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
                      <Text><Trans>Map with</Trans>...</Text>
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
              <Trans>This field is required</Trans>
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderExternalId() {
    const { externalId, externalIdFields } = this.state;
    const current: CSVField = externalIdFields.find(field => field.value === externalId);
    if (current === undefined) {
      return null;
    }

    return (
      <>
        <Trans>Unique identifier</Trans>
        <View flexDirection="row" flexWrap="wrap" borderColor="soft" paddingY={3}>
          {/* Mapping action on desktop */}
          <View
            width={[1 / 2, 1 / 2, 1 / 2]}
            display="none"
            css={{
              [foundations.breakpoints.md]: { display: "flex" },
            }}
          >
            <View maxWidth="220">
              <Select
                options={externalIdFields}
                value={externalId}
                onChange={({ target }) => this.onMapExternalId(target.value)}
              >
              </Select>
            </View>
          </View>

          {/* Mapping action on mobile */}
          <View
            width={[1 / 2, 1 / 2, 1 / 2]}
            css={{
              [foundations.breakpoints.md]: { display: "none" },
            }}
          >
            <SelectDropdown
              optionRenderer={null}
              closeOnSelection={true}
              value={current.value}
              options={externalIdFields}
              onChange={({ target }) => this.onMapExternalId(target.value)}
            >
              {({ ref, getToggleButtonProps }) => (
                <ButtonFilled
                  {...getToggleButtonProps()}
                  innerRef={ref}
                  justifyContent="flex-start"
                >
                  <View flexDirection="row" alignItems="center">
                    {current.value && <IconCheckbox marginRight={3} />}
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
                      {current.label || (
                        <Text><Trans>Map with</Trans>...</Text>
                      )}
                    </Text>
                  </View>
                </ButtonFilled>
              )}
            </SelectDropdown>
          </View>
        </View>
        <Text
          color='subtle'
          fontSize={2}>
          <Trans>Set a field with a unique value as the unique identifier</Trans>
        </Text>
      </>
    )
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
      go1Fields = [],
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
              <Trans>Done</Trans>
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
              <IconChevronLeft />
              <Text fontSize={2} marginLeft={3}>
                <Trans>Your data feed</Trans>
              </Text>
            </View>
          )}

          <Text fontWeight="semibold" fontSize={4} marginBottom={3}>
            {!isEditing && <Trans>Create mapping rules</Trans>}
            {isEditing && <Trans>Data mapping details</Trans>}
          </Text>
          <Text marginTop={2}>
            {!isEditing && <Trans>Map the fields in your CSV file to the portal fields</Trans>}
            {isEditing && <Trans>You can edit your current mapping rules</Trans>}
          </Text>

          {go1Fields.length > 0 && (
            <>
              <View width="100%" marginTop={6}>
                {this.renderExternalId()}
              </View>

              <View width="100%" marginTop={6}>
                {mappingError && (
                  <Banner type="danger" marginBottom={6}>
                    <Text css={{ whiteSpace: "pre-line" }}>{mappingError}</Text>
                  </Banner>
                )}

                <View flexDirection="row" flexWrap="wrap" marginBottom={4}>
                  <View width={[5 / 6, 1 / 2, 1 / 2]}>
                    <Text fontSize={2} fontWeight="semibold" textTransform="uppercase" color="subtle">
                      <Trans>Portal fields</Trans>
                    </Text>
                  </View>

                  <View width={[1 / 6, 1 / 2, 1 / 2]}>
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
                      <Trans>CSV fields</Trans>
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
                      {showOptionalFields ? <IconChevronUp /> : <IconChevronDown />}
                      <Text fontSize={2} marginLeft={3}>
                        {!showOptionalFields && <Trans>Show all optional fields</Trans>}
                        {showOptionalFields && <Trans>Hide all optional fields</Trans>}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View flexDirection="row" justifyContent={isEditing ? "flex-end" : "space-between"} width="100%" marginTop={7}>
                {!isEditing && (
                  <ButtonFilled size="lg" onClick={() => onCancel()}>
                    <Trans>Cancel</Trans>
                  </ButtonFilled>
                )}

                {!isEditing && (
                  <ButtonFilled color="accent" size="lg" onClick={() => this.onMappingDone()}>
                    <Trans>Next</Trans>
                  </ButtonFilled>
                )}

                {isEditing && !touched && (
                  <ButtonFilled color="accent" size="lg" onClick={() => onCancel()}>
                    <Trans>Done</Trans>
                  </ButtonFilled>
                )}

                {isEditing && touched && (
                  <ButtonFilled color="accent" size="lg" onClick={() => this.onMappingDone()}>
                    <Trans>Update</Trans>
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
          <Trans>Select file</Trans>
        </Text>
        <Text marginTop={2}>
          <Trans>Browse for a CSV file to upload for setting up fields mapping rules. For reference, please download <Text color="accent"><Link
            href="/sample-csv.csv">sample CSV file</Link></Text> to check the column format</Trans>
        </Text>

        <View
          border={1}
          borderColor={uploadError ? 'danger' : 'faded'}
          borderRadius={2}
          backgroundColor="faint"
          marginTop={6}
          width={[1, 1, 4 / 5]}
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
              {({ open, getRootProps, isDragActive }) => (
                <View
                  {...getRootProps({ refKey: 'innerRef' })}
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
                    <IconInteractive marginRight={3} />

                    <Text
                      css={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {
                        isDragActive
                          ? <Trans>Drop it here</Trans>
                          : <Trans>Drag and drop to upload</Trans>
                      }
                    </Text>
                  </View>

                  <Button icon={IconUpload}>
                    <Trans>Choose a file</Trans>
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
                  <Spinner marginRight={3} size={3} />
                  <Text color="subtle"><Trans>Uploading</Trans>...</Text>
                </View>
              )}

              {isUploadingFailed && (
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <View flexDirection="row" alignItems="center">
                    <IconNotPassed color="danger" marginRight={3} size={3} />
                    <Text color="danger">
                      <Trans>Upload failed</Trans>
                    </Text>
                  </View>
                  <Button
                    color="accent"
                    onClick={() => this.setState({ isShowUploader: true, uploadError: null })}
                  >
                    <Trans>Retry</Trans>
                  </Button>
                </View>
              )}
            </View>
          )}

          {uploadError && (
            <Text data-testid="UploadError" marginTop={2} color="danger">{uploadError}</Text>
          )}
        </View>

        <View flexDirection="row" justifyContent="flex-start" width="100%" marginTop={7}>
          <ButtonFilled size="lg" onClick={() => onCancel()}>
            <Trans>Cancel</Trans>
          </ButtonFilled>
        </View>
      </>
    );
  }

  private validate() {
    const { go1Fields = [] } = this.state;
    const invalidFields = go1Fields.filter(field => field.required && !field.mappedField);

    return invalidFields.length === 0;
  }

  private mapFields() {
    let mappedFields = {};
    const { go1Fields = [] } = this.state;

    go1Fields.forEach(go1Field => {
      mappedFields[go1Field.name] = go1Field.mappedField || '';
    });

    return mappedFields;
  }

  private getAvailableExternalIdFields(go1Fields: MappingField[]): CSVField[] {
    return go1Fields
      .filter((field: MappingField) => field.weight === "74")
      .map((field: MappingField) => ({
        value: field.name,
        label: (<Text fontSize={2} textTransform="capitalize">{field.label}</Text>),
      }));
  }

  private getMappedFields(csvHeader: string[] = []) {
    const { go1Fields = [] } = this.state;
    const mappedFields = csvHeader.length > 0 ? csvHeader : [];

    if (mappedFields.length === 0 && go1Fields) {
      go1Fields.forEach(field => {
        const { mappedField } = field;

        if (!!mappedField && !mappedFields.includes(mappedField)) {
          mappedFields.push(mappedField);
        }
      });
    }

    return mappedFields.map(fieldName => {
      return {
        value: fieldName,
        label: fieldName,
      };
    });
  }
}

export default DataFeedUploadState;
