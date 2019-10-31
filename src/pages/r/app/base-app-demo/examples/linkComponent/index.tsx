import * as React from 'react';
import { ButtonFilled, View, Container, Text } from '@go1d/go1d';
import Layout from '@src/components/common/Layout/index';
import { getBaseUrl } from "@src/config";
import Link from "@src/components/common/Link";

export class LinkUsage extends React.Component<any,any> {
  public render() {
    return (
      <Layout wrappingContainer title="Example usage of the new LinkComponent">
        <ButtonFilled href={getBaseUrl( "base-app-demo")} color="accent">Back to Overview</ButtonFilled>
        <View  backgroundColor="background" padding={5} borderRadius={2} marginTop={5}>
          <Text fontWeight="semibold">Current Base URL: getBaseUrl( &quot;base-app-demo&quot;) = {getBaseUrl( "base-app-demo")}</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Text fontWeight="semibold">Current Base URL if only one module in app:  getBaseUrl() = {getBaseUrl()}</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link module="base-app-demo" href="/examples/protectedRoute">Link to Protected Route Example with module attribute</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href={`${getBaseUrl( "base-app-demo")}/examples/protectedRoute`}>Link to Protected Route Example using getBaseURL()</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href="/r/app/explore">External Link To Explore</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href="/p/#/app/dashboard">External Link To Apiom</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href="app/dashboard" isApiomLink>External Link To Apiom with isApiomLink attribute</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href="https://www.google.com">External Link To Google</Link>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          <Link href="https://www.google.com" target="_blank">External Link To Google with target attribute</Link>
        </View>
      </Layout>
    );
  }
}

export default LinkUsage;
