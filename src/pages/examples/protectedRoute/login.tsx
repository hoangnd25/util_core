import * as React from 'react';
import { View, Container, Text } from '@go1d/go1d';
import Layout from '../../../components/Layout/index';

class LoginPage extends React.Component<any,any> {
  public render() {
    return (
      <Layout wrappingContainer={true}>
        <View marginBottom={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">Login needed</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          If you are seeing this page, you most probably do not have any login information stored in localstorage. If you are a developer, please check that the env variable <Text fontWeight="bold">LOCAL_JWT</Text> is set.
        </View>
      </Layout>
    );
  }
}
export default LoginPage;
