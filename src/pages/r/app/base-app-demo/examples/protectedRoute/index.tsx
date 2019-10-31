import * as React from 'react';
import { ButtonFilled, View, Container, Text } from '@go1d/go1d';
import withAuth from '@src/components/common/WithAuth';
import Layout from '@src/components/common/Layout/index';
import { getBaseUrl } from "@src/config";

export class NeedLogin extends React.Component<any,any> {
  public render() {
    const { currentSession } = this.props;
    return (
      <Layout wrappingContainer>
        <ButtonFilled href={getBaseUrl( "base-app-demo")} color="accent">Back to Overview</ButtonFilled>
        <View marginY={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">User Details</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          {currentSession && Object.keys(currentSession.user).map((key) => {
            return <View key={`user${key}`}>{key}: {(currentSession.user[key] || "").toString()}</View>;
          })}
        </View>
        <View marginY={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">Account Details</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          {currentSession && Object.keys(currentSession.account).map((key) => {
            return <View key={`account${key}`}>{key}: {(currentSession.account[key] || "").toString()}</View>;
          })}
        </View>
        <View marginY={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">Portal Details</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          {currentSession && Object.keys(currentSession.portal).map((key) => {
            return <View key={`portal${key}`}>{key}: {(currentSession.portal[key] || "").toString()}</View>;
          })}
        </View>
        <View marginY={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">JWT</Text>
        </View>
        <View backgroundColor="background" padding={5} css={{ "word-break":"break-all" }}>
          {currentSession.jwt}
        </View>
      </Layout>
    );
  }
}

export default withAuth(NeedLogin);
