import React from 'react';
import { Text, View, InputGroup, foundations, ButtonFilled, ButtonMinimal, Tooltip } from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import { AWSCredential } from '../../types/userDataFeed';
import { defineMessagesList } from '../../utils/translation';
import CopyToClipboard from '../CopyToClipboard';

interface Props {
  intl: any,
  awsCredential: AWSCredential;
  backgroundColor?: string;
  expandable?: boolean;
}

interface State {
  expanded: boolean;
  copied: boolean;
}

export class AWSConnectionDetail extends React.PureComponent<Props, State> {
  state = {
    expanded: false,
    copied: false,
  };

  onCopyToClipboard(result: boolean) {
    if (result) {
      this.setState({ copied: true });
    }
  }

  renderCopyButton(copied = false) {
    const { intl } = this.props;
    const CopyButton = (
      <ButtonFilled
        border={1}
        borderColor="faded"
        color="soft"
        iconName="Copy"
        transition="none"
        minHeight="48"
        css={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          lineHeight: 48,

          '&:hover': {
            transform: 'translate(0, 0)',
          },
        }}
      >
        <FormattedMessage id="awsConnectionDetail.buttonCopy" defaultMessage="Copy" />
      </ButtonFilled>
    );

    if (copied) {
      return (
        <Tooltip tip={intl.formatMessage(defineMessagesList().awsConnectionDetailCopied)}>{CopyButton}</Tooltip>
      );
    }

    return CopyButton;
  }

  renderAWSField(fieldValue: string, isSecretField?: boolean) {
    const { copied } = this.state;

    return (
      <InputGroup>
        <View alignItems="center" flexDirection="row" width="100%">
          <View
            backgroundColor="background"
            minHeight="48"
            borderColor="faded"
            borderRight={0}
            border={1}
            paddingX={4}
            flexGrow={1}
            flexShrink={1}
            css={{
              borderTopLeftRadius: foundations.spacing[2],
              borderBottomLeftRadius: foundations.spacing[2],
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
                top: isSecretField ? foundations.spacing[2] : 0,
              }}
            >{isSecretField ? '********************' : fieldValue}</Text>
          </View>

          <CopyToClipboard
            text={fieldValue}
            onCopy={(text, result) => this.onCopyToClipboard(result)}
            onMouseOut={() => this.setState({ copied: false })}
          >
            {this.renderCopyButton(copied)}
          </CopyToClipboard>
        </View>
      </InputGroup>
    );
  }

  render() {
    const { expanded } = this.state;
    const { backgroundColor, awsCredential, expandable } = this.props;
    const isConnectionDetailVisible = expandable ? expanded : true;

    return (
      <View
        backgroundColor={backgroundColor}
        borderColor={expandable ? "soft" : "transparent"}
        border={expandable ? 1 : 0}
        borderRadius={expandable ? 2 : 0}
        padding={expandable ? 4 : 0}
      >
        <View flexDirection="row" alignItems="center">
          <View flexGrow={1} flexShrink={1}>
            <Text fontWeight="semibold" fontSize={expandable ? 3 : 4} marginBottom={3}>
              <FormattedMessage id="awsConnectionDetail.title" defaultMessage="AWS Connection Details" />
            </Text>
            <Text marginTop={2}>
              <FormattedMessage id="awsConnectionDetail.description" defaultMessage="Integrate using the following details to keep your user records up to date" />
            </Text>
          </View>

          {expandable && (
            <ButtonMinimal
              color="accent"
              onClick={() => this.setState({ expanded: !expanded })}
            >
              {!isConnectionDetailVisible && (
                <FormattedMessage id="awsConnectionDetail.toggleConnectionShow" defaultMessage="Show" />
              )}

              {isConnectionDetailVisible && (
                <FormattedMessage id="awsConnectionDetail.toggleConnectionHide" defaultMessage="Hide" />
              )}
            </ButtonMinimal>
          )}
        </View>

        {isConnectionDetailVisible && (
          <View width={[1, 1, 3/5]} alignItems="flex-start">
            <View width="100%" marginTop={6}>
              <Text marginBottom={3}>
                <FormattedMessage id="awsConnectionDetail.fieldBucketURL" defaultMessage="Bucket URL" />
              </Text>

              {this.renderAWSField(awsCredential.awsBucketUrl)}
            </View>

            <View width="100%" marginTop={6}>
              <Text marginBottom={3}>
                <FormattedMessage id="awsConnectionDetail.fieldAccessKey" defaultMessage="Access key" />
              </Text>

              {this.renderAWSField(awsCredential.awsAccessKeyId, true)}
            </View>

            <View width="100%" marginTop={6}>
              <Text marginBottom={3}>
                <FormattedMessage id="awsConnectionDetail.fieldSecretKey" defaultMessage="Secret key" />
              </Text>

              {this.renderAWSField(awsCredential.awsSecretKey, true)}
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default injectIntl(AWSConnectionDetail);
