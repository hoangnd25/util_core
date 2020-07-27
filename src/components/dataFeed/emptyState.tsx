import * as React from 'react';
import { I18n } from "@lingui/react"
import { Trans, t } from "@lingui/macro"
import { EmptyState } from '@go1d/go1d';

interface Props {
  onStart: () => void;
}

class DataFeedEmptyState extends React.Component<Props> {
  public render() {
    const { onStart } = this.props;

    return (
      <I18n>
        {({ i18n }) =>
          <EmptyState
            title={i18n._(t`Get started`)}
            actionText={i18n._(t`Get started`)}
            action={() => onStart()}
          >
            <Trans>You don’t have a S3 folder. Start creating your folder and set up mapping rules.</Trans>
          </EmptyState>
        }
      </I18n>
    );
  }
}

export default DataFeedEmptyState;
