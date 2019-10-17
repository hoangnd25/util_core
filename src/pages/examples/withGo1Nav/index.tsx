import * as React from 'react';
import { View, Container, Text } from '@go1d/go1d';
import withAuth from '../../../components/WithAuth';
import Layout from '../../../components/Layout/index';

export class ExampleWithNav extends React.Component<any,any> {
  public render() {
    return (
      <Layout withTopNav wrappingContainer containerProps={{alignItems:"center"}}>
        This is an example with the navigation and a wrapping container. Consider moving the Layout component into _app and wrapp it around &lt;Component/&gt;, in case they are the same for all pages.
      </Layout>
    );
  }
}

export default withAuth(ExampleWithNav);
