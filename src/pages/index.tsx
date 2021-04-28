import * as React from 'react';
import Router from 'next/router';
import { getBaseUrl } from '@src/config';
import withAuth from '@src/components/common/WithAuth';

class IndexRedirect extends React.Component<any, any> {
  public componentDidMount() {
    const { currentSession } = this.props;
    if (currentSession?.account.isAdministrator && !currentSession?.account.isContentAdministrator) {
      Router.push(getBaseUrl());
    } else {
      Router.push(`${getBaseUrl()}/access-denied`);
    }
  }

  public render() {
    return null;
  }
}

export default withAuth(IndexRedirect);
