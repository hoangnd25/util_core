import * as React from 'react';
import { I18n } from "@lingui/core"
import { Trans, t } from "@lingui/macro"
import { EmptyState } from '@go1d/go1d';

interface Props {
  onStart: () => void;
  i18n: I18n;
}

class DataFeedEmptyState extends React.Component<Props> {
  public render() {
    const { onStart, i18n } = this.props;

    return (
      <EmptyState
        title={i18n._(t`Get started`)}
        actionText={i18n._(t`Get started`)}
        action={() => onStart()}
      >
        <Trans>You don’t have a S3 folder. Start creating your folder and set up mapping rules.</Trans>
      </EmptyState>
    );
  }
}

export default DataFeedEmptyState;
