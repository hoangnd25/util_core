import * as React from 'react';
import { View, Text, EmptyState } from '@go1d/go1d';
import { injectIntl, FormattedMessage } from 'react-intl';
import { defineMessagesList } from '../../utils/translation';

interface Props {
  onStart: (step: number) => void;
  intl: any
}

class DataFeedEmptyState extends React.Component<Props> {
  public render() {
    const { intl, onStart } = this.props;

    return (
      <EmptyState
        title={intl.formatMessage(defineMessagesList().dataFeedEmptyBlockTitle)}
        actionText={intl.formatMessage(defineMessagesList().dataFeedEmptyBlockActionText)}
        action={() => onStart(1)}
      >
        <FormattedMessage id="empty.block.content" defaultMessage="You haven’t config any your S3 bucket yet. Creating your first mapping."/>
      </EmptyState>
    );
  }
}

export default injectIntl(DataFeedEmptyState);
