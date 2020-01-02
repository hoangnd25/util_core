import * as React from 'react';
import { EmptyState } from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import { defineMessagesList } from '@src/utils/translation';

interface Props {
  onStart: () => void;
  intl: any
}

class DataFeedEmptyState extends React.Component<Props> {
  public render() {
    const { intl, onStart } = this.props;

    return (
      <EmptyState
        title={intl.formatMessage(defineMessagesList().dataFeedEmptyBlockTitle)}
        actionText={intl.formatMessage(defineMessagesList().dataFeedEmptyBlockActionText)}
        action={() => onStart()}
      >
        <FormattedMessage id="empty.block.content" defaultMessage="You don’t have a S3 folder. Start creating your folder and set up mapping rules."/>
      </EmptyState>
    );
  }
}

export default injectIntl(DataFeedEmptyState);
