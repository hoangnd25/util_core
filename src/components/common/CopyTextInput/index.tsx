import React from 'react';
import { ButtonMinimal, View, Text, Tooltip, TextInput } from '@go1d/go1d';
import IconCopy from '@go1d/go1d/build/components/Icons/Copy';
import CopyToClipboard from '@src/components/common/CopyToClipboard';

class CopyTextInput extends React.Component<any, any> {
  state = {
    copied: false,
  };

  onCopyToClipboard = (result: boolean) => {
    if (result) {
      this.setState({ copied: true });
    }
  };

  renderCopyButton = (copied = false) => {
    const CopyButton = <ButtonMinimal color="faded" icon={IconCopy}></ButtonMinimal>;

    if (copied) {
      return <Tooltip tip={'Copied!'}>{CopyButton}</Tooltip>;
    }
    return CopyButton;
  };

  public render() {
    const { copied } = this.state;
    const { fieldValue, fieldName } = this.props;
    return (
      <View paddingY={4}>
        <Text paddingBottom={3}>{fieldName}</Text>
        <TextInput
          id="clear"
          viewCss={{ boxShadow: 'none' }}
          label="Username"
          value={fieldValue}
          suffixNode={
            <CopyToClipboard
              text={fieldValue}
              onCopy={(text, result) => this.onCopyToClipboard(result)}
              onMouseOut={() => this.setState({ copied: false })}
            >
              {this.renderCopyButton(copied)}
            </CopyToClipboard>
          }
        ></TextInput>
      </View>
    );
  }
}

export default CopyTextInput;
