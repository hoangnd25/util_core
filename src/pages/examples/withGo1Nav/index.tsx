import * as React from 'react';
import { View, Container, Text } from '@go1d/go1d';
import withAuth from '../../../components/WithAuth';
import Layout from '../../../components/Layout/index';

export class ExampleWithNav extends React.Component<any,any> {
  public render() {
    return (
      <Layout withTopNav wrappingContainer containerProps={{alignItems:"center"}}>
        This is an example with the navigation and a wrapping container.
      </Layout>
    );
  }
}

export default withAuth(ExampleWithNav);
