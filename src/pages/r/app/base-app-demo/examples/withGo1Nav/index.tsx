import * as React from 'react';
import { ButtonFilled, View, Container, Text } from '@go1d/go1d';
import withAuth from '@src/components/common/WithAuth';
import Layout from '@src/components/common/Layout/index';
import { getBaseUrl } from "@src/config";

export class ExampleWithNav extends React.Component<any,any> {
  public render() {
    return (
      <Layout withTopNav wrappingContainer containerProps={{ alignItems:"center" }}>
        <ButtonFilled href={getBaseUrl( "base-app-demo")} color="accent">Back to Overview</ButtonFilled>
        <View>This is an example with the navigation and a wrapping container. Consider moving the Layout component into _app and wrapp it around &lt;Component/&gt;, in case they are the same for all pages.</View>
      </Layout>
    );
  }
}

export default withAuth(ExampleWithNav);
