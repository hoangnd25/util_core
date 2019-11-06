import React from 'react';
import { View } from '@go1d/go1d';
import { copyToClipboard } from '@src/utils/clipboard';

interface Props {
  text: string;
  onCopy?: (text: string, result: boolean) => void;
  onMouseOut?: () => void;
  options?: {
    debug: boolean,
    message: string,
  };
}

interface State {
  copied: boolean;
}

class CopyToClipboard extends React.PureComponent<Props, State> {
  state: {
    copied: false,
  };

  onClickCopy() {
    const { text, onCopy, options } = this.props;
    const result = copyToClipboard(text, options);

    if (onCopy) {
      onCopy(text, result);
    }
  };


  render() {
    const { children, onMouseOut } = this.props;

    return (
      <View
        onClick={() => this.onClickCopy()}
        onMouseOut={() => onMouseOut ? onMouseOut() : null}
      >{children}</View>
    );
  }
}

export default CopyToClipboard;
