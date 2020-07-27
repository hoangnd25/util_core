import * as React from 'react';
import Router from "next/router";
import { getBaseUrl } from '@src/config';

class IndexRedirect extends React.Component {
  public componentDidMount() {
    Router.push(getBaseUrl());
  }

  public render() {
    return null;
  }

}

export default IndexRedirect;
